<script>
	let dev = false;
</script>

<div class="flex flex-wrap content-evenly justify-center w-[92vw] text-nord5">
	<span style="flex: 0 1 100%;" class="flex justify-center my-px h-min p-2 w-11/12 text-center">
		<span class="bg-red-600 w-full">NO</span>
	</span>
	<span style="flex: 0 1 100%;" class="flex justify-center my-px h-min p-2 text-center">
		<a href="/artists/{dev ? 'dev' : ''}" class="bg-blue-600 p-2 rounded text-lg w-32">ARTISTS</a>
	</span>
	<span style="flex: 0 1 100%;" class="flex justify-center my-px h-min p-2 text-center">
		<a href="/albums/{dev ? 'dev' : ''}" class="bg-blue-600 p-2 rounded text-lg w-32">ALBUMS</a>
	</span>
</div>
