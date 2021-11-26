<script>
	import SongListItem from '$lib/ui/SongListItem.svelte';
	import { songs } from '../../stores/store';
</script>

<div class="flex flex-wrap content-evenly justify-center w-[92vw] mx-auto py-4 text-nord5">
	{#each $songs as s, i}
		<SongListItem song={s} counter={i} />
	{:else}
		<!-- empty list -->
	{/each}
</div>
