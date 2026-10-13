<script>
	let { name } = $props();

	function fade() {
		return { duration: 100, css: (t) => `opacity: ${t}` };
	}
</script>

<p out:fade onoutrostart={() => console.log('outro')}>{name}</p>
