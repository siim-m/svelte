<script>
	let { text } = $props();
	let count = $state(0);
</script>

<p>{text}</p>
<button onclick={() => count++}>{count}</button>
