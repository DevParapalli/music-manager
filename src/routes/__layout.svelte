<script>
	import '../app.scss';
	import PlayerNav from '$lib/ui/PlayerNav.svelte';
	export const ssr = false;
</script>

<PlayerNav>
	<div class="h-stretch">
	<slot />
	</div>	
</PlayerNav>

<style>
	.h-stretch {
		height: calc(100vh - 6rem);
	}
</style>
