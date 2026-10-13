import { flushSync, tick } from 'svelte';
import { test } from '../../test';

export default test({
	mode: ['hydrate'],

	async test({ assert, target, hydrate, logs, raf }) {
		hydrate();
		await tick();

		// the transition is local to the `{#if}` block, even though `<Child>` hydrated after an `await`
		target.querySelector('button')?.click();
		flushSync();
		assert.deepEqual(logs, ['outro']);
		assert.equal(target.querySelectorAll('p').length, 1);

		raf.tick(100);
		flushSync();
		assert.equal(target.querySelectorAll('p').length, 0);
	}
});
