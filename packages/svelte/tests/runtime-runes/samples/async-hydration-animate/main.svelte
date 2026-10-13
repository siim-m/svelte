<script>
	let items = $state([1, 2]);

	function anim() {
		console.log('animate');
		return { duration: 100 };
	}
</script>

<button onclick={() => items.reverse()}>reverse</button>

{#each items as item (item)}
	<svelte:element this={await Promise.resolve('div')} animate:anim>{item}</svelte:element>
{/each}
