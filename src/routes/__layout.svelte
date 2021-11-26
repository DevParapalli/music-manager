<script context="module">
	export const ssr = false;
</script>

<script>
	import '../app.scss';
	import PlayerNav from '$lib/ui/PlayerNav.svelte';
</script>

<PlayerNav>
	<div class="h-stretch flex-grow">
		<slot />
	</div>
</PlayerNav>

<style>
	.h-stretch {
		height: calc(100vh - 6rem);
	}
</style>
