import { tick } from 'svelte';
import { test } from '../../test';

export default test({
	mode: ['hydrate'],
	recover: true,

	async test({ assert, target, hydrate, logs, warnings }) {
		const p = /** @type {HTMLParagraphElement} */ (target.querySelector('p'));

		// simulate e.g. Chrome's page translation modifying the DOM before hydration
		p.innerHTML = '<font><font>B</font></font>';

		hydrate();

		// wait for the nested async work started by the failed hydration attempt to settle
		await new Promise((resolve) => setTimeout(resolve, 50));
		await tick();

		assert.htmlEqual(
			target.innerHTML,
			'<header>header</header><span>a</span><p>b</p><footer>footer</footer>'
		);
		assert.deepEqual(logs, ['mount a']);
		assert.deepEqual(warnings, [
			'Hydration failed because the initial UI does not match what was rendered on the server'
		]);
	}
});
