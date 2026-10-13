<script>
	let { name } = $props();

	$effect(() => {
		console.log(`mount ${name}`);
		return () => console.log(`destroy ${name}`);
	});
</script>

<span>{name}</span>
