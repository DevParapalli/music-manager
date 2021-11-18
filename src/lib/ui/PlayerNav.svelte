<script>
	function navigate_back() {
		window.history.back();
	}
	// {iconName
	//					.toLowerCase()
	//					.replace(/ /g, '-')
	//					.replace(/[-]+/g, '-')
	//					.replace(/[^\w-]+/g, '')}

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { get } from 'svelte/store';
	//import { appWindow } from '@tauri-apps/api/window';
	import { pageTitle, Queue, currentStatus } from '../../stores/store';
	import nanobar from 'nanobar';

	onMount(async () => {
		//current_value.subscribe((value) => {
		//		progressBar.go(Number(value));
		//	});
		//appWindow.setTitle(get(pageTitle));
		//pageTitle.subscribe((title) => {
		//appWindow.setTitle(title);
		//});
	});

	// Plyr Stuff
	import { Plyr } from 'svelte-plyr';
	import VolumeSlider from './VolumeSlider.svelte';
	let player;

	// Plyr Integration Stuff.
	let eventsEmitted = ['timeupdate', 'play', 'pause', 'ready', 'progress', 'ended'];
	let progressBar, bufferBar;
	//function 
	
	// Play/Pause
	let isPlaying = false;

	function play(event) {
		//console.log(event)
		isPlaying = true;
	}


	function pause(event) {
		//console.log(event)
		isPlaying = false;
	}


	// Skip to Next Source
	function next(event) {
		//console.log(event)
		$currentStatus.queue_position += 1;
		if ($currentStatus.queue_position > $Queue.length - 1) {
			$currentStatus.queue_position = $Queue.length - 1;
			return
		}
		$currentStatus = Object.assign({}, $currentStatus, $Queue[$currentStatus.queue_position]) //$Queue[$currentStatus.queue_position]
		// Reset Play Toggle to Paused
		isPlaying = false;
		// Setup Source
		//console.log($currentStatus, $Queue)
		player.source = $Queue[$currentStatus.queue_position].source;

		// Reset Time Progress Bar to 0.
		progressBar.go(0);
		// Use the player to play the next source.
		try {
			player.togglePlay();
		} catch (error) {
			console.log('%c [Plyr] cannot autoplay unless the user interacts with the page. ', 'background-color: red; color: white;')
			//console.log(error);
			
		}
		
	}
	// Previous
	function previous(event) {
		//console.log(event)
		$currentStatus.queue_position -= 1;
		if ($currentStatus.queue_position < 0) {
			$currentStatus.queue_position = 0;
			return
		}
		$currentStatus = Object.assign({}, $currentStatus, $Queue[$currentStatus.queue_position]) //$Queue[$currentStatus.queue_position]
		// Reset Play Toggle to Paused
		isPlaying = false;
		// Setup Source
		//console.log($currentStatus, $Queue)
		player.source = $Queue[$currentStatus.queue_position].source;

		// Reset Time Progress Bar to 0.
		progressBar.go(0);
		// Use the player to play the next source.
		
		player.togglePlay();
	}


	// next song if ended.
	function ended(event) {
		//console.log(event)
		next();
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
		${(durationMinutes < 10) ? '0' + durationMinutes : durationMinutes} : 
		${(durationSeconds < 10) ? '0' + durationSeconds : durationSeconds}
		`;
		progressBar.go(Number(event.detail.currentTime / event.detail.duration) * 100);
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
		player.source = $currentStatus.source
		if ($currentStatus.queue_position === -1) {
			next();
			player.pause();
		}
		//console.log(player.source)
		isReady = true;
		console.log('%c [plyr] Player Ready ', 'background-color: green; text-color: white')
		
	}


	// Handle clicks for timeskip.
	function handle_timeskip_click(event) {
		let bar = document.getElementById('progress-bar');
		let x = event.pageX - bar.offsetLeft;
		let y = event.pageY - bar.offsetTop;
		let clickedValue = (x * 1) / bar.offsetWidth;
		//console.table({'x':x, 'y':y, 'value':clickedValue})
		if (player) {
			let newDuration = clickedValue * player.duration;
			player.currentTime = newDuration;
			//console.log(newDuration, clickedValue, player.duration)
		}
	}
	// Progress timeskip
	//function handle_progress(event) {
	//	console.log(event.detail.buffered);
	//}
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
	function handle_keypress(event) {
		if (event.ctrlKey ||  event.altKey) {
			return;
		}
		event.preventDefault();
		//console.log(event)
		if (player) {
			switch (event.key) {
				case 'k':
					player.togglePlay();
					break;
				case 'l':
					next();
					break;
				case 'j':
					// Skip to Previous Song
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
						<li class="py-2 text-center hover:bg-nord2 rounded">
							<a href="/">
								<span class="h-5 w-5 mx-auto text-nord4 inline-block transition-colors duration-200"
									><img
										src="https://api.iconify.design/fe/play.svg?color=%23d8dee9"
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
										src="https://api.iconify.design/fe/home.svg?color=%23d8dee9"
										alt=""
										class="mx-auto h-6 w-6"
									/>
								</span>
							</a>
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
		<div class="flex w-full justify-center bg-nord1 align-middle">
			<slot />
		</div>
	</div>
	<div id="player" class="flex bg-nord2 flex-col content-between self-center w-full h-24 align-middle select-none">
		<div id="progress-bar" on:click={handle_timeskip_click}>
			<!--
				<div class="nanobar progress-bar" style="position: relative;">
					<div class="bar" style="width: 10%;"></div>
				</div>
			-->
		</div>
		<ul class="flex flex-1 flex-row items-center h-20">
			<li class="flex pl-4">
				<span id="skip-previous" on:click="{previous}" class="p-4 cursor-pointer rounded-full hover:text-nord6 hover:shadow-md hover:bg-nord3 active:bg-nord1">
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
				<span id="skip-next" on:click="{next}" class="p-4 cursor-pointer rounded-full hover:text-nord6 hover:shadow-md hover:bg-nord3 active:bg-nord1">
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
					<img class="rounded h-16 w-16" src="{$currentStatus.album_art || 'https://dummyimage.com/64x64'}" alt="Album Art" />
				</span>
			</li>
			<li class="flex-grow px-4 text-left flex flex-col select-text">
				<span>{$currentStatus.title}</span>
				<span>{$currentStatus.album} | {$currentStatus.artist}</span>
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
							d="M14.83 13.41l-1.41 1.41l3.13 3.13L14.5 20H20v-5.5l-2.04 2.04l-3.13-3.13M14.5 4l2.04 2.04L4 18.59L5.41 20L17.96 7.46L20 9.5V4m-9.41 5.17L5.41 4L4 5.41l5.17 5.17l1.42-1.41z"
							fill="currentColor"
						/></svg
					>
				</span>
				<span class="px-2">
					<!--Volume Slider-->
					<VolumeSlider bind:value={volume} />
				</span>
				<span class="text-gray-400 text-sm">{currentTime || '00:00'} / {duration || '00:00'}</span>
			</li>
		</ul>
	</div>
</div>

<div class="hidden">
	<Plyr
		bind:player
		on:ready={ready}
		on:timeupdate={timeupdate}
		on:play={play}
		on:pause={pause}
		on:ended={ended}
		eventsToEmit={eventsEmitted}
	>
		<audio id="audio" crossorigin="" playsinline>
			<source src="/" type="audio/mp3" />
		</audio>
	</Plyr>
</div>

<svelte:window on:keydown="{handle_keypress}" />