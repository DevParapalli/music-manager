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
	import { pageTitle, current_value } from '../../stores/store';
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
	let player;
	let altsource = {
		type: 'audio',
		sources: [
			{
				src: 'https://cors-anywhere.herokuapp.com/https://www.bensound.com/bensound-music/bensound-betterdays.mp3',
				type: 'audio/mp3'
			}
		]
	};

	// Plyr Integration Stuff.
	let eventsEmitted = ['timeupdate', 'play', 'pause', 'ready', 'progress'];
	let progressBar, bufferBar;
	// Play/Pause
	$: isPlaying = false;

	function play(event) {
		//console.log(event)
		isPlaying = true;
	}
	function pause(event) {
		//console.log(event)
		isPlaying = false;
	}
	// Function for updating elements based on time.
	function timeupdate(event) {
		//console.table(event.detail)
		//console.log(progressBar)
		//handle_progress(event);

		progressBar.go(Number(event.detail.currentTime / event.detail.duration) * 100);
	}
	// create ProgressBar when the player is ready.
	function ready(event) {
		let playerProgress = document.getElementById('progress-bar');
		// Setup Main Progress Bar
		progressBar = new nanobar({
			classname: 'progress-bar',
			target: playerProgress
		});
		// Setup BufferProgressBar
		//bufferBar = document.createElement('div');
		//bufferBar.classList.add('buffer-bar');
		//bufferBar['go'] = (percent) => (bufferBar.style.width = `${percent}%`);
		//console.log('%c [plyr] Player Ready ', 'background-color: green; text-color: white')
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
		<div class="flex w-full justify-center align-middle">
			<slot />
		</div>
	</div>
	<div id="player" class="flex flex-col self-center w-full h-24 align-middle select-none">
		<div id="progress-bar" on:click={handle_timeskip_click}>
			<!--
				<div class="nanobar progress-bar" style="position: relative;">
					<div class="bar" style="width: 10%;"></div>
				</div>
			-->
		</div>
		<ul class="flex flex-1 flex-row items-center h-20">
			<li class="flex pl-4">
				<span id="skip-previous" class="p-4 cursor-pointer rounded-full">
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
					on:click|preventDefault={() => player.togglePlay()}
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
				<span id="skip-next" class="p-4 cursor-pointer rounded-full">
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
					<img class="rounded" src="https://dummyimage.com/64x64" alt="Album Art" />
				</span>
			</li>
			<li class="flex-grow-[2] px-4 text-left flex flex-col select-text">
				<span>SONG NAME</span>
				<span>ARTIST NAME | ALBUM NAME</span>
			</li>
			<li class="flex-grow-[1] flex flex-row">
				<span>
					<svg
						class="h-8 w-8"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						><path d="M14.83 13.41l-1.41 1.41l3.13 3.13L14.5 20H20v-5.5l-2.04 2.04l-3.13-3.13M14.5 4l2.04 2.04L4 18.59L5.41 20L17.96 7.46L20 9.5V4m-9.41 5.17L5.41 4L4 5.41l5.17 5.17l1.42-1.41z" fill="currentColor" /></svg
					>
				</span>
				<span>VOLUME CONTROLS ??</span>
				<span>TIME / LEFT</span>
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
		eventsToEmit={eventsEmitted}
	>
		<audio crossorigin="" playsinline>
			<source
				src="https://cors-anywhere.herokuapp.com/https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3"
				type="audio/mp3"
			/>
			<source
				src="https://cors-anywhere.herokuapp.com/https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg"
				type="audio/ogg"
			/>
		</audio>
	</Plyr>
</div>
