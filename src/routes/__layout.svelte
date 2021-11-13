<script>
	import '../app.scss';
	import NavBar from '$lib/ui/NavBar.svelte';
	export const ssr = false;
</script>

<NavBar>
	<div class="flex justify-center flex-row w-full h-stretch text-nord5 bg-gradient-to-br from-nord2 via-nord1 to-nord0">
		<slot />
	</div>
</NavBar>

<style>
	.h-stretch {
		height: calc(100vh - 5rem);
	}
</style>
