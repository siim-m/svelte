/** @import { Blocker, TemplateNode, Value } from '#client' */
import { EFFECT_TRANSPARENT } from '#client/constants';
import { HYDRATION_ERROR } from '../../../../constants.js';
import { component_context, set_component_context } from '../../context.js';
import { flatten } from '../../reactivity/async.js';
import { branch } from '../../reactivity/effects.js';
import { get } from '../../runtime.js';
import { get_first_child, get_next_sibling } from '../operations.js';
import {
	hydrate_next,
	hydrate_node,
	hydrating,
	set_hydrate_node,
	set_hydrating,
	skip_nodes
} from '../hydration.js';
import { assign_nodes } from '../template.js';

/**
 * @param {TemplateNode} node
 * @param {Blocker[]} blockers
 * @param {Array<() => Promise<any>>} expressions
 * @param {(anchor: TemplateNode, ...deriveds: Value[]) => void} fn
 */
export function async(node, blockers = [], expressions = [], fn) {
	var was_hydrating = hydrating;
	/** @type {TemplateNode | null} */
	var end = null;

	if (was_hydrating) {
		hydrate_next();
		end = skip_nodes(false);
		assign_nodes(node, end); // Necessary if this wraps the sole child of a block, else end marker can be wrong
	}

	if (expressions.length === 0 && blockers.every((b) => b.settled)) {
		fn(node);

		// This is necessary because it is not guaranteed that the render function will
		// advance the hydration node to $.async's end marker: it may stop at an inner
		// block's end marker (in case of an inner if block for example), but it also may
		// stop at the correct $.async end marker (in case of component child) - hence
		// we can't just use hydrate_next()
		// TODO this feels indicative of a bug elsewhere; ideally we wouldn't need
		// to double-traverse in the already-resolved case
		if (was_hydrating) {
			set_hydrate_node(end);
		}

		return;
	}

	if (was_hydrating) {
		var previous_hydrate_node = hydrate_node;
		set_hydrate_node(end);
	}

	flatten(blockers, [], expressions, (values) => {
		var context = component_context;
		var previous = null;

		if (was_hydrating) {
			set_hydrating(true);
			set_hydrate_node(previous_hydrate_node);
			previous = node.previousSibling;
		}

		try {
			// get values eagerly to avoid creating blocks if they reject
			for (const d of values) get(d);

			if (was_hydrating) {
				// If hydration fails, this branch takes everything we created with it, including
				// nested async work. It's transparent so that it doesn't affect which transitions
				// are considered local
				branch(() => fn(node, ...values), EFFECT_TRANSPARENT);
			} else {
				fn(node, ...values);
			}
		} catch (error) {
			if (!was_hydrating || error !== HYDRATION_ERROR) {
				throw error;
			}

			// The DOM was modified before hydration (e.g. by a browser extension or page translation).
			// `hydrate()` has already returned, so it can't recover by remounting the app. Instead,
			// we remove the server-rendered content and render this block from scratch. The start
			// marker may have been removed along with the content, so we put it back
			var anchor = /** @type {TemplateNode} */ (end);
			var sibling =
				previous === null
					? get_first_child(/** @type {Node} */ (anchor.parentNode))
					: get_next_sibling(previous);

			while (sibling !== anchor) {
				var next = get_next_sibling(/** @type {TemplateNode} */ (sibling));
				/** @type {TemplateNode} */ (sibling).remove();
				sibling = next;
			}

			anchor.before(node);
			set_hydrating(false);
			set_component_context(context);

			fn(anchor, ...values);
		} finally {
			if (was_hydrating) {
				set_hydrating(false);
			}
		}
	});
}
