<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	function navigate_back() {
		window.history.back();
	}
	// {iconName
	//					.toLowerCase()
	//					.replace(/ /g, '-')
	//					.replace(/[-]+/g, '-')
	//					.replace(/[^\w-]+/g, '')}

	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto, prefetch } from '$app/navigation';
	//import { appWindow } from '@tauri-apps/api/window';
	import { pageTitle, queue, currentStatus, queueEndedState, songs } from '../../stores/store';
	import nanobar from 'nanobar';
	import universalParse from 'id3-parser/lib/universal/index.js';




	// Plyr Stuff
	import { Plyr } from 'svelte-plyr';
	import VolumeSlider from './VolumeSlider.svelte';
	let player;

	// Plyr Integration Stuff.
	let eventsEmitted = [
		'timeupdate',
		'play',
		'pause',
		'ready',
		'progress',
		'ended',
		'loadedmetadata'
	];
	let progressBar;

	function update_handler(status) {
		switch (status) {
			case '':
				// Empty case, do nothing.
				break;

			case 'next':
				next('');
				break;

			case 'previous':
				previous('');
				break;

			case 'play':
				player.play();
				break;

			case 'skip':
				player.source = $currentStatus.source;
				player.play();
				break;

			default:
				console.log(
					`%c [Player] Invalid update state : ${status} `,
					'background-color: black; color: red;'
				);
				break;
		}
		$currentStatus.update = '';
	}
	$: update_handler($currentStatus.update);

	// Play/Pause
	let isPlaying = false;
	function play(event) {
		if (player.source === '/404.mp3') {
			player.pause();
		}
		//Event emmited for UI updates.
		isPlaying = true;
	}

	function pause(event) {
		//Event emmited for UI updates.
		isPlaying = false;
	}

	// Skip to Next Source
	function next(event) {
		//console.log(event)
		$currentStatus.queue_position += 1;
		if ($currentStatus.queue_position > $queue.length - 1) {
			console.log(
				'%c [Plyr] Cannot "NEXT" from last song on queue.',
				'background-color: black; color: yellow'
			);
			$currentStatus.queue_position = $queue.length - 1;
			return;
		}
		$currentStatus = Object.assign({}, $currentStatus, $queue[$currentStatus.queue_position]);
		// Reset Play Toggle to Paused
		isPlaying = false;
		// Setup Source
		//console.log($currentStatus, $Queue)
		player.source = $queue[$currentStatus.queue_position].source;

		// Reset Time Progress Bar to 0.
		progressBar.go(0);
		// Use the player to play the next source.
		try {
			player.togglePlay();
		} catch (error) {
			console.log(
				'%c [Plyr] Cannot autoplay unless the user has interacted with the page. ',
				'background-color: black; color: red;'
			);
			//console.log(error);
		}
	}
	// Previous
	function previous(event) {
		//console.log(event)
		$currentStatus.queue_position -= 1;
		if ($currentStatus.queue_position < 0) {
			$currentStatus.queue_position = 0;
			return;
		}
		$currentStatus = Object.assign({}, $currentStatus, $queue[$currentStatus.queue_position]); //$Queue[$currentStatus.queue_position]
		// Reset Play Toggle to Paused
		isPlaying = false;
		// Setup Source
		//console.log($currentStatus, $Queue)
		player.source = $queue[$currentStatus.queue_position].source;

		// Reset Time Progress Bar to 0.
		progressBar.go(0);
		// Use the player to play the next source.

		player.togglePlay();
	}

	// next song if ended.
	function ended(event) {
		if ($currentStatus.queue_position < $queue.length - 1) {
			next('');
		} else {
			console.log(
				'%c [Plyr] Cannot "NEXT" from last song on queue, CAUSE: SONG END',
				'background-color: black; color: yellow'
			);
			$currentStatus.queue_position = $queue.length;
			$currentStatus = Object.assign({}, $currentStatus, queueEndedState);
			// Prevent Player from playing previous song.
			player.source = queueEndedState.source;
		}
	}

	// Function for updating elements based on time.
	let currentTime, duration;
	function timeupdate(event) {
		//console.table(event.detail)
		//console.log(progressBar)
		//handle_progress(event);
		let currentMinutes = Math.floor(event.detail.currentTime / 60);
		let currentSeconds = Math.floor(event.detail.currentTime - currentMinutes * 60);
		currentTime = `
		${currentMinutes < 10 ? '0' + currentMinutes : currentMinutes} : 
		${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}
		`;
		let durationMinutes = Math.floor(event.detail.duration / 60);
		let durationSeconds = Math.floor(event.detail.duration - durationMinutes * 60);
		duration = `
		${durationMinutes < 10 ? '0' + durationMinutes : durationMinutes} : 
		${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}
		`;
		progressBar.go(Number(event.detail.currentTime / event.detail.duration) * 100);
	}

	// to run on loadedmetadata
	async function metadata_update(event) {
		//if ($currentStatus.parsed) {
		//	return;
		//}
		//TODO: Add a condition check for MP3
		const metadata = await universalParse($currentStatus.source.sources[0].src);
		$currentStatus.album = metadata.album;
		$currentStatus.title = metadata.title;
		$currentStatus.artist = metadata.artist;
		if (metadata.image) {
					// @ts-ignore
					let blob = new Blob([metadata.image.data], { type: metadata.image.mime });
					let urlCreator = window.URL || window.webkitURL;
					let imageUrl = urlCreator.createObjectURL(blob);
					$currentStatus.album_art = imageUrl;
				}
		$currentStatus.parsed = true;
		$queue[$currentStatus.queue_position] = Object.assign({}, $currentStatus);
	}

	// create ProgressBar when the player is ready and only get ready once.
	let isReady = false;
	function ready(event) {
		if (isReady) {
			return;
		}
		let playerProgress = document.getElementById('progress-bar');
		// Setup Main Progress Bar
		progressBar = new nanobar({
			classname: 'progress-bar',
			target: playerProgress
		});
		// Setup Current Song in Player
		player.source = $currentStatus.source;
		if ($currentStatus.queue_position <= 0) {
			next('');
			player.pause();
		} else {
			player.source = $queue[$currentStatus.queue_position].source;		
		}

		isReady = true;
		console.log('%c [plyr] Player Ready ', 'background-color: black; color: green');
	}

	// Handle clicks for timeskip.
	function handle_timeskip_click(event) {
		//console.log(event)
		let bar = document.getElementById('progress-bar');
		let x = event.pageX - bar.offsetLeft;
		//console.log(x)
		let y = event.pageY - bar.offsetTop;
		let clickedValue = (x * 1) / bar.offsetWidth;
		//console.log(clickedValue)
		//console.table({'x':x, 'y':y, 'value':clickedValue})
		if (player) {
			let newDuration = clickedValue * player.duration;
			player.currentTime = newDuration;
			//player.forward(newDuration - player.currentTime);
			//console.log(newDuration,player.currentTime, player)
		}
	}

	// Process Volume
	let volume;
	function handle_volume_change(volume) {
		//console.log(volume)
		if (player) {
			player.volume = volume / 100;
			//console.log(player.volume)
		}
		//volume = event.detail.volume;
	}
	$: handle_volume_change(volume);

	// Keyboard Shortcuts for Player
	function handle_key(event) {
		if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
			return;
		}
		event.preventDefault();
		//console.log(event);
		if (player) {
			switch (event.key.toLowerCase()) {
				case 'k':
					player.togglePlay();
					break;
				case 'l':
					next('');
					break;
				case 'j':
					previous('');
					break;
				case 'i':
					// Shuffle Queue
					break;
				case 'ArrowLeft':
					player.currentTime -= 5;
					break;
				case 'ArrowRight':
					player.currentTime += 5;
					break;
				case 'ArrowUp':
					volume += 10;
					break;
				case 'ArrowDown':
					volume -= 10;
					break;
				default:
					break;
			}
		}
	}

	function flush_status() {
		localStorage.setItem('currentStatus', JSON.stringify($currentStatus).replaceAll('"parsed":true', '"parsed":false'));
		localStorage.setItem('songs', JSON.stringify($songs).replaceAll('"parsed":true', '"parsed":false'))
		localStorage.setItem('queue', JSON.stringify($queue).replaceAll('"parsed":true', '"parsed":false'))
	};
</script>

<div class="flex flex-col">
	<div class="flex flex-row">
		<nav class="bg-nord0 w-16 h-auto justify-between flex flex-col">
			<div class="mt-4 mb-10">
				<a href="/profile" class="hover:bg-nord3 hidden">
					<img
						src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
					AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
						9TXL0Y4OHwAAAABJRU5ErkJggg=="
						class="rounded-full w-16 h-16 mb-3 mx-auto border-2 border-nord3 hover:bg-nord2"
						alt="indenticon"
					/>
				</a>
				<div class="mt-4">
					<ul>
						<li
							class="py-2 text-center hover:bg-nord2 rounded cursor-pointer"
							on:click={() => goto('/player/queue')}
						>
							<span>
								<span
									class="h-5 w-5 mx-auto px-auto text-nord4 inline-block transition-colors duration-200"
									><img
										src="https://api.iconify.design/mdi/playlist-music.svg?color=%23d8dee9"
										alt=""
										class="mx-auto h-6 w-6"
									/>
								</span>
							</span>
						</li>
						<li
							class="py-2 text-center hover:bg-nord2 rounded cursor-pointer"
							on:click={() => goto('/songs')}
						>
							<span>
								<span class="h-5 w-5 mx-auto text-nord4 inline-block transition-colors duration-200"
									><img
										src="https://api.iconify.design/mdi/music-note.svg?color=%23d8dee9"
										alt=""
										class="mx-auto h-6 w-6"
									/>
								</span>
							</span>
						</li>
						<li class="py-2 text-center hover:bg-nord2">
							<a href="./">
								<span class="h-5 w-5 mx-auto text-nord4 inline-block transition-colors duration-200"
									><img
										src="https://api.iconify.design/fe/home.svg?color=%23d8dee9"
										alt=""
										class="mx-auto h-6 w-6"
									/>
								</span>
							</a>
						</li>
						<li class="py-2 text-center hover:bg-nord2">
							<a href="/">
								<span class="h-5 w-5 mx-auto text-nord4 inline-block transition-colors duration-200"
									><img
										src="https://api.iconify.design/fe/phone.svg?color=%23d8dee9"
										alt=""
										class="mx-auto h-6 w-6"
									/>
								</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="mb-8 mx-3">
				<span on:click|preventDefault={navigate_back} class="h-12 w-12">
					<!--Back Button, bottom of the sidebar-->
					<svg
						class="fill-current h-8 w-8 text-nord10 hover:text-nord6 mx-auto rounded hover:bg-nord11"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11h12z"
							fill="currentColor"
						/>
					</svg>
				</span>
			</div>
		</nav>
		<div
			class="flex overflow-x-hidden overflow-y-scroll w-full justify-center bg-nord1 align-middle"
		>
			<slot />
		</div>
	</div>
	<div
		id="plyr"
		class="flex bg-nord2 flex-col content-between self-center w-full h-24 align-middle select-none"
	>
		<div id="progress-bar" on:click={handle_timeskip_click}>
			<!--
				<div class="nanobar progress-bar" style="position: relative;">
					<div class="bar" style="width: 10%;"></div>
				</div>
			-->
		</div>
		<ul class="flex flex-1 flex-row items-center h-20">
			<li class="flex pl-4">
				<span
					id="skip-previous"
					on:click={previous}
					class="p-4 cursor-pointer rounded-full hover:text-nord6 hover:shadow-md hover:bg-nord3 active:bg-nord1"
				>
					<svg
						class="h-8 w-8"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						><path d="M6 18V6h2v12H6m3.5-6L18 6v12l-8.5-6z" fill="currentColor" /></svg
					>
				</span>
				<span
					id="playback-toggle"
					class="p-4 cursor-pointer rounded-full hover:text-nord6 hover:shadow-md hover:bg-nord3 active:bg-nord1"
					transition:fade
					on:click={player.togglePlay}
				>
					<svg
						class="h-8 w-8"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						><path
							d={isPlaying ? 'M14 19h4V5h-4M6 19h4V5H6v14z' : 'M8 5.14v14l11-7l-11-7z'}
							fill="currentColor"
						/></svg
					>
				</span>
				<span
					id="skip-next"
					on:click={next}
					class="p-4 cursor-pointer rounded-full hover:text-nord6 hover:shadow-md hover:bg-nord3 active:bg-nord1"
				>
					<svg
						class="h-8 w-8"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						><path d="M16 18h2V6h-2M6 18l8.5-6L6 6v12z" fill="currentColor" /></svg
					>
				</span>
			</li>
			<li class="pl-8 pr-4">
				<span class="max-h-16 max-w-16">
					<img
						class="rounded h-20 w-20 object-cover"
						src={$currentStatus.album_art || '/defaults/default_album_image.svg'}
						alt="Album Art"
					/>
				</span>
			</li>
			<li class="flex-grow px-4 text-left flex flex-col select-text">
				<span>{$currentStatus.title}</span>
				{#if $currentStatus.artist}
					<span>{$currentStatus.album} | {$currentStatus.artist}</span>
				{:else}
					<span>{$currentStatus.album}</span>
				{/if}
			</li>
			<li class="ml-auto mr-6 flex flex-row">
				<span>
					<svg
						class="h-7 w-7 mx-4"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						><path
							d="M15 6H3v2h12V6m0 4H3v2h12v-2M3 16h8v-2H3v2M17 6v8.18c-.31-.11-.65-.18-1-.18a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3V8h3V6h-5z"
							fill="currentColor"
						/></svg
					>
				</span>
				<span>
					<svg
						class="h-7 w-7 mx-4"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						><path
							d="M15 6H3v2h12V6m0 4H3v2h12v-2M3 16h8v-2H3v2M17 6v8.18c-.31-.11-.65-.18-1-.18a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3V8h3V6h-5z"
							fill="currentColor"
						/></svg
					>
				</span>
				<span>
					<svg
						class="h-7 w-7 mx-4"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						><path
							d="M15 6H3v2h12V6m0 4H3v2h12v-2M3 16h8v-2H3v2M17 6v8.18c-.31-.11-.65-.18-1-.18a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3V8h3V6h-5z"
							fill="currentColor"
						/></svg
					>
				</span>
				<span class="px-2">
					<!--Volume Slider-->
					<VolumeSlider bind:value={volume} />
				</span>
				<span class="text-gray-400 text-sm w-32"
					>{currentTime || '00:00'} / {duration || '00:00'}</span
				>
			</li>
		</ul>
	</div>
</div>

<div class="hidden">
	<Plyr
		bind:player
		on:timeupdate={timeupdate}
		on:play={play}
		on:pause={pause}
		on:ready={ready}
		on:progress={flush_status}
		on:ended={ended}
		on:loadedmetadata={metadata_update}
		eventsToEmit={eventsEmitted}
	>
		<audio id="audio" crossorigin="" playsinline>
			<source src="/" type="audio/mp3" />
		</audio>
	</Plyr>
</div>

<svelte:window on:keydown={handle_key} />
