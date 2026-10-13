<script>
	let items = $state([1, 2]);
	let tag = await Promise.resolve('div');

	function anim() {
		console.log('animate');
		return { duration: 100 };
	}
</script>

<button onclick={() => items.reverse()}>reverse</button>

{#each items as item (item)}
	<svelte:element this={tag} animate:anim>{item}</svelte:element>
{/each}
