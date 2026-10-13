<script>
	import Child from './Child.svelte';
</script>

<header>header</header>
<Child name={await Promise.resolve('b')} />
<footer>footer</footer>
