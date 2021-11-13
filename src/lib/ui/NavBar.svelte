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
	import { get } from 'svelte/store';
	import { appWindow } from '@tauri-apps/api/window';
	import { pageTitle } from '../../stores/store';
	import HiddenPlayer from '$lib/ui/HiddenPlayer.svelte';

	onMount(async () => {
		appWindow.setTitle(get(pageTitle));
		pageTitle.subscribe((title) => {
			appWindow.setTitle(title);
		});
	});

	/*
	import nanobar from 'nanobar';
	let progressBar = new nanobar({
		id: 'progress-bar',
		classname: 'progress-bar'
	});
	import {current_value} from '../../stores/store';
	current_value.subscribe((value) => {
		progressBar.go(Number(value));
	});
	
*/

	// Plyr Stuff
	import { Plyr } from 'svelte-plyr';
	export let player;
	let altsource = {
		type: 'audio',
		sources: [
			{
				src: 'https://cors-anywhere.herokuapp.com/https://www.bensound.com/bensound-music/bensound-betterdays.mp3',
				type: 'audio/mp3'
			}
		]
	};
</script>

<div class="flex flex-col">
	<div class="flex flex-row">
		<nav class="bg-nord0 w-12 h-auto justify-between flex flex-col">
			<div class="mt-4 mb-10">
				<a href="/profile" class="hover:bg-nord3">
					<img
						src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
					AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
						9TXL0Y4OHwAAAABJRU5ErkJggg=="
						class="rounded-full w-12 h-12 mb-3 mx-auto border-2 border-nord3 hover:bg-nord2"
						alt="indenticon"
					/>
				</a>
				<div class="mt-4">
					<ul>
						<li class="py-2 text-center hover:bg-nord2">
							<a href="/" on:click|preventDefault={() => player.togglePlay()}>
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
			<div class="mb-8 ml-2">
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
	<div class="flex flex-colself-center w-full h-24 align-middle">
		<ul class="flex flex-1 flex-row items-center h-20">
			<li class="flex pl-4">
				<span id="skip-previous" class="p-4 cursor-pointer ">
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
				<span id="playback-toggle" class="p-4 cursor-pointer">
					<svg
						class="h-8 w-8"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"><path d="M14 19h4V5h-4M6 19h4V5H6v14z" fill="currentColor" /></svg
					>
				</span>
				<span id="skip-next" class="p-4 cursor-pointer">
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
				<span class="max-h-16 max-w-16" >
					<img class="rounded" src="https://dummyimage.com/64x64" alt="Album Art" />
					</span
				>
			</li>
			<li class="flex-grow-[2] px-4 text-left flex flex-col">
				<span>SONG NAME?</span>
				<span>ARTIST NAME | ALBUM NAME</span>
			</li>
			<li class="flex-grow-[1]">
				<span>REPEAT</span>
				<span>SHUFFLE</span>
				<span>VOLUME CONTROLS ??</span>
				<span></span>
				<span>TIME / LEFT</span>
			</li>
		</ul>
	</div>
</div>

<div class="hidden">
	<Plyr bind:player>
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
