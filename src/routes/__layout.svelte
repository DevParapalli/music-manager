<script>
	import '../app.scss';
	import PlayerNav from '$lib/ui/PlayerNav.svelte';
	export const ssr = false;
</script>

<PlayerNav>
	<div class="flex justify-center flex-row w-full h-stretch text-nord5 bg-gradient-to-br from-nord2 via-nord1 to-nord0">
		<slot />
	</div>
</PlayerNav>

<style>
	.h-stretch {
		height: calc(100vh - 6rem);
	}
</style>
