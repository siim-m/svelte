import { tick } from 'svelte';
import { test } from '../../test';

export default test({
	mode: ['client', 'hydrate'],

	async test({ assert, target, logs, raf }) {
		await tick();

		const divs = [...target.querySelectorAll('div')];
		assert.equal(divs.length, 2);

		for (const div of divs) {
			div.getBoundingClientRect = () => {
				const top = [...target.querySelectorAll('div')].indexOf(div) * 20;
				return /** @type {DOMRect} */ ({
					x: 0,
					y: top,
					left: 0,
					right: 10,
					top,
					bottom: top + 10,
					width: 10,
					height: 10
				});
			};
		}

		target.querySelector('button')?.click();
		await tick();

		assert.htmlEqual(target.innerHTML, '<button>reverse</button><div>2</div><div>1</div>');
		assert.deepEqual(logs, ['animate', 'animate']);
		raf.tick(100);
	}
});
