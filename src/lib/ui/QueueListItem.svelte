<script lang="ts">
	export let counter = -1;
	export let song = <Song>{
		title: 'SONG TITLE',
		artist: 'SONG ARTIST',
		album: 'SONG ALBUM',
		album_art: '/defaults/default_song_image.svg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/404.mp3',
					type: 'audio/mp3'
				}
			]
		}
	};
	import { queue, currentStatus, Song } from '../../stores/store';


	function play(event) {
		//console.log(event);
		if (
			$currentStatus.title === song.title &&
			$currentStatus.artist === song.artist &&
			$currentStatus.album === song.album
		) {
			// Exit if the song is already playing
			return;
		}
		$currentStatus = Object.assign({}, $currentStatus, song);
		$currentStatus.queue_position = counter;
		$currentStatus.update = 'skip';
		// Triggering Svelte's Reactivity
		$queue = $queue;
	}
</script>

<div
	on:dblclick={play}
	class="flex flex-row rounded-xl bg-nord3 {counter === $currentStatus.queue_position
		? 'border-2 border-nord14'
		: ''} transition-all duration-200 hover:bg-nord2 w-full p-2 my-1"
>
	<span class="self-center p-2 w-[3rem]">
		{counter + 1}
	</span>
	<img
		src={song.album_art}
		alt="Placeholder for Album Art"
		class="ml-2 rounded-lg h-16 w-16 object-cover text-white"
	/>
	<div class="flex flex-col self-center">
		<span class="ml-4 w-80 self-center">{song.title}</span>
		<span class="ml-4 w-80 self-center text-slate-400">{song.album}</span>
	</div>
	<span class="ml-6 self-center text-slate-300">{song.artist}</span>
	<!--Spacer for Elements-->
	<span class="self-center flex-grow" />
	<span
		class="p-2 self-center rounded-full  {counter === $currentStatus.queue_position
			? 'hidden'
			: 'cursor-pointer'} draggable-handle"
		title="Drag to Reorder"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
			class="h-6 w-6"
		>
			<path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z" fill="currentColor" />
		</svg>
	</span>
</div>
