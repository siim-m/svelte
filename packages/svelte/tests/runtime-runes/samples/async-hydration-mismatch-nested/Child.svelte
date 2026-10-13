<script>
	import Inner from './Inner.svelte';

	let { name } = $props();

	const delayed = () => new Promise((resolve) => setTimeout(() => resolve('a'), 20));
</script>

<Inner name={await delayed()} />
<p>{name}</p>
