<script>
	import Inner from './Inner.svelte';

	let { name } = $props();
</script>

{#if name}
	<Inner name="a" />
{/if}

<p>{name}</p>
