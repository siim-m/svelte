<script>
	import Child from './Child.svelte';

	let show = $state(true);
</script>

<button onclick={() => (show = false)}>hide</button>

{#if show}
	<Child name={await Promise.resolve('a')} />
{/if}
