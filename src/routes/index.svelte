<script>
	import { dev } from '$app/env';
</script>

<div class="flex flex-wrap content-evenly justify-center w-full text-nord5">
	<span style="flex: 0 1 100%;" class="flex justify-center my-px h-min p-2 text-center">
		<a href="/songs/{dev ? 'dev' : ''}" class="bg-green-600 p-2 rounded text-lg w-32">SONGS</a>
	</span>
	<span style="flex: 0 1 100%;" class="flex justify-center my-px h-min p-2 text-center">
		<a href="/artists/{dev ? 'dev' : ''}" class="bg-green-600 p-2 rounded text-lg w-32">ARTISTS</a>
	</span>
	<span style="flex: 0 1 100%;" class="flex justify-center my-px h-min p-2 text-center">
		<a href="/albums/{dev ? 'dev' : ''}" class="bg-green-600 p-2 rounded text-lg w-32">ALBUMS</a>
	</span>
</div>

<style>
</style>
