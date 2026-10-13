<script>
	import Greeting from './Greeting.svelte';
</script>

<header>header</header>

<svelte:boundary onerror={() => console.log('onerror')}>
	<Greeting />

	{#snippet failed()}
		<p>failed</p>
	{/snippet}
</svelte:boundary>
