<script>
	import SongListItem from '$lib/ui/SongListItem.svelte';
	import { songs } from '../../stores/store';
	import { path, fs } from '@tauri-apps/api';

	import { onMount } from 'svelte';
	onMount(async () => {
		if (window.__TAURI__) {
			console.log('%c [Tauri] Running inside tauri-runtime, Initializing default library');
			let libraryPath = await path.audioDir();
			let files = await fs.readDir(libraryPath);
			for (let i = 0; i < 30; i++) {
				const realPath = files[Math.floor(Math.random() * files.length)].path
				//@ts-ignore
				let array = new Uint8Array(await fs.readBinaryFile(realPath))
				let blob = new Blob([array], {type: 'audio/mp3'})
				let urlCreator = window.URL || window.webkitURL;
				let song_url = urlCreator.createObjectURL(blob);
				$songs[$songs.length] = {
					parsed: false,
					source: {
						type: 'audio',
						sources: [
							{
								type: 'audio/mp3',
								src: `${song_url}`
							}
						]
					}
				};
			}
		}
	});
</script>

<div class="flex flex-wrap content-evenly justify-center w-[92vw] mx-auto py-4 text-nord5">
	{#each $songs as s, i}
		<SongListItem song={s} counter={i} />
	{:else}
		<!-- empty list -->
	{/each}
</div>
