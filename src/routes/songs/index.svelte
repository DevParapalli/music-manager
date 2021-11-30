<script>
	import SongListItem from '$lib/ui/SongListItem.svelte';
	import { songs, ScanList } from '../../stores/store';
	import { onMount } from 'svelte';
	import { inview } from 'svelte-inview/dist/index';
	
	let start = 0;
	let end = 10;
	let hasMore = true;

	async function fetchLibrary() {
		let response = await fetch("http://localhost:7200/fs/dir?dir=C:\\Users\\parap\\Music\\")
		//let response = await fetch("http://localhost:7200/fs/dir?dir=C:\\DevParapalli\\Projects\\music-manager\\static")
		let json = await response.json();
		ScanList.set(json.data.files)
	}

	async function fetchSong(filePath) {
		let response = await fetch("http://localhost:7200/fs/file/metadata?file=" + filePath)
		let json = await response.json();
		$songs[$songs.length] = {
			title: json.data.title,
			artist: json.data.artist,
			album: json.data.album,
			album_art: json.data.album_art,
			parsed: true,
			source: {
				type: 'audio',
				sources: [
					{
						src: 'http://localhost:7200/fs/file?file=' + filePath,
						type: 'audio/mp3'
					}
				]
			}
		}
	}
	async function fetchSongs() {
		for (const file of $ScanList.slice(start, end)) {
			await fetchSong(file)
		}
	}

	function end_in_view(event) {
		if (event.detail.inView && hasMore) {
			start = end;
			end += 10;
			fetchSongs();
		}
		else if (end >= $ScanList.length) {
			hasMore = false;
			end = $ScanList.length;
		}
	}
	onMount(async () => {
		await fetchLibrary();
		await fetchSongs();
	});
</script>

<div class="flex flex-wrap content-evenly justify-center w-[92vw] mx-auto py-4 text-nord5">
	{#each $songs as s, i}
		<SongListItem song={s} counter={i} />
	{:else}
		<!-- empty list -->
	{/each}
</div>

<!--This is the element that gets viewed-->
<div use:inview={{rootMargin:'100%'}} on:change={end_in_view} />