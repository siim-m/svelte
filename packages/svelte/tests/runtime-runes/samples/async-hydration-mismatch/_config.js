import { flushSync, tick } from 'svelte';
import { test } from '../../test';

export default test({
	mode: ['hydrate'],
	recover: true,

	async test({ assert, target, hydrate, logs, warnings }) {
		const header = target.querySelector('header');
		const p = /** @type {HTMLParagraphElement} */ (target.querySelector('p'));

		// simulate e.g. Chrome's page translation modifying the DOM before hydration
		p.innerHTML = '<font><font>hallo</font></font>';

		hydrate();
		await tick();

		assert.htmlEqual(target.innerHTML, '<header>header</header><p>hello</p><button>0</button>');
		assert.equal(target.querySelector('header'), header);
		assert.deepEqual(logs, []);
		assert.deepEqual(warnings, [
			'Hydration failed because the initial UI does not match what was rendered on the server'
		]);

		target.querySelector('button')?.click();
		flushSync();
		assert.htmlEqual(target.innerHTML, '<header>header</header><p>hello</p><button>1</button>');
	}
});
