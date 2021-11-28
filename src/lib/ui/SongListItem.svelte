<script lang="ts">
	import { onMount } from 'svelte';
	import universalParse from 'id3-parser/lib/universal';

	onMount(() => {
		let src = $songs[counter].source.sources[0].src;
		let isParsed = $songs[counter].parsed;
		if (isParsed) {
			return;
		}
		if (src.slice(-3) === 'mp3') {
			universalParse(src).then((metadata) => {
				$songs[counter].parsed = true;
				$songs[counter].title = metadata.title;
				$songs[counter].artist = metadata.artist;
				$songs[counter].album = metadata.album;
				//img.src = `data:${picture.format};base64,${picture.data.toString('base64')}`;
				if (metadata.image) {
					// @ts-ignore
					let blob = new Blob([metadata.image.data], { type: metadata.image.mime });
					let urlCreator = window.URL || window.webkitURL;
					let imageUrl = urlCreator.createObjectURL(blob);
					$songs[counter].album_art = imageUrl;
				}
			});
		} else {
			console.log('NO PARSER FOUND');
		}
	});

	export let counter = NaN;
	export let song = {
		title: 'SONG TITLE',
		artist: 'SONG ARTIST',
		album: 'SONG ALBUM',
		album_art: 'https://dummyimage.com/440/',
		parsed: false,
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

	import { queue, currentStatus, songs } from '../../stores/store';

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
		$queue.splice($currentStatus.queue_position + 1, 0, song);
		$currentStatus.update = 'next';
		// Triggering Svelte's Reactivity
		$queue = $queue;
	}

	function addNext(event) {
		let songOnTargetPosition = $queue[$currentStatus.queue_position + 1]; // Check if Next Song is aleady in queue
		if (
			songOnTargetPosition.title === song.title &&
			songOnTargetPosition.artist === song.artist &&
			songOnTargetPosition.album === song.album
		) {
			// Exit if the song is already queued next
			return;
		}
		$queue.splice($currentStatus.queue_position + 1, 0, song);
		$queue = $queue;
	}
	function addEnd(event) {
		let songBeforeTargetPosition = $queue[$queue.length - 1];
		if (
			songBeforeTargetPosition.title === song.title &&
			songBeforeTargetPosition.artist === song.artist &&
			songBeforeTargetPosition.album === song.album
		) {
			// Exit if the song is already queued at end
			return;
		}
		$queue.splice($queue.length, 0, song);
		$queue = $queue;
	}
	function edit(event) {
		console.log(
			'%c [Player] Function "EDIT" not implimented.',
			'background-color: black; color: red;'
		);
	}
</script>

<div class="flex flex-row rounded-xl bg-nord3 hover:bg-nord2 w-full p-2 my-1">
	<span class="self-center p-2 w-[3rem]">
		{counter + 1}
	</span>
	<img
		src={song.album_art}
		alt="Placeholder for Album Art"
		class="ml-2 rounded-lg h-16 w-16 object-cover"
	/>
	<div class="flex flex-col self-center">
		<span class="ml-4 w-80 self-center">{song.title}</span>
		<span class="ml-4 w-80 self-center text-slate-400">{song.album}</span>
	</div>
	<span class="ml-6 self-center text-slate-300">{song.artist}</span>
	<!--Spacer for Elements-->
	<span class="self-center flex-grow" />
	<span class="p-2 self-center rounded-full hover:bg-nord3" title="Play" on:click={play}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
			class="h-8 w-8"
			><path d="M8.5 8.64L13.77 12L8.5 15.36V8.64M6.5 5v14l11-7" fill="currentColor" />
		</svg>
	</span>
	<span class="p-2 self-center rounded-full hover:bg-nord3" title="Play Next" on:click={addNext}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
			class="h-8 w-8"
			><path
				d="M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m-1 12v-2h2v2h-2z"
				fill="currentColor"
			/>
		</svg>
	</span>
	<span class="p-2 self-center rounded-full hover:bg-nord3" title="Play At End" on:click={addEnd}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
			class="h-8 w-8"
		>
			<path
				d="M17 12a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 4-4.9V3h2v4.1a5 5 0 0 1 4 4.9m-5-3a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m-1 12v-2h2v2h-2z"
				fill="currentColor"
			/>
		</svg>
	</span>
	<span class="p-2 self-center rounded-full hover:bg-nord3" title="Edit Metadata" on:click={edit}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
			class="h-6 w-6"
		>
			<path
				d="M14.06 9l.94.94L5.92 19H5v-.92L14.06 9m3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
				fill="currentColor"
			/>
		</svg>
	</span>
</div>
