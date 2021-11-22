<script>
	let dev = false;
	import SongListItem from "$lib/ui/SongListItem.svelte";
	import {songs} from "../../stores/store"
</script>

<div class="flex flex-wrap content-evenly justify-center w-[92vw] mx-auto mt-4 text-nord5">
	{#each $songs as s}
	<SongListItem song={s}/>
	{:else}
		 <!-- empty list -->
	{/each}
</div>
