<script>
	import SongListItem from '$lib/ui/SongListItem.svelte';
	import { songs, ScanList } from '../../stores/store';
	import { onMount } from 'svelte';
	onMount(async () => {
		// We should do this for each library
		const libraryResp = await fetch(
			'http://localhost:7200/fs/dir?dir=C:\\Users\\parap\\Music\\'
		);
		const libraryData = await libraryResp.json();
		$ScanList = libraryData.data.files
		for (const song of libraryData.data.files.slice(0, 7)) {
			const songResp = await fetch('http://localhost:7200/fs/file/metadata?file=' + song);
			const songData = await songResp.json();
			$songs[$songs.length] = {
				title: songData.data.title,
				artist: songData.data.artist,
				album: songData.data.album,
				album_art: songData.data.album_art,
				parsed: true,
				source: {
					type: 'audio',
					sources: [
						{
							src: 'http://localhost:7200/fs/file?file=' + song,
							type: 'audio/mp3'
						}
					]
				}
			};
		}
	});
	let current_index = 0;
</script>

<div class="flex flex-wrap content-evenly justify-center w-[92vw] mx-auto py-4 text-nord5">
	{#each $songs as s, i}
		<SongListItem song={s} counter={i} />
	{:else}
		<!-- empty list -->
	{/each}
</div>
