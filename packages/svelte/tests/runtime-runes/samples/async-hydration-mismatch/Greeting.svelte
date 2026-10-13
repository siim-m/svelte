<script>
	import Message from './Message.svelte';

	const text = $derived(await Promise.resolve('hello'));
</script>

{#if text}
	<Message {text} />
{/if}
