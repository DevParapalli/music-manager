<script>
import { assign } from 'svelte/internal';

	export let song = {
		title: 'SONG TITLE',
		artist: 'SONG ARTIST',
		album: 'SONG ALBUM',
		album_art:
			'https://dummyimage.com/440/',
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
    import {queue, currentStatus} from '../../stores/store'

    function play(event) {
        //console.log(event);
        $currentStatus = Object.assign({}, $currentStatus, song)
        $queue.splice($currentStatus.queue_position+1, 0, song)
        // TODO: Work out how the fuck to do this.
        // Update a seperate store for the update state ?
        //update_state()
    }
    function addNext(event) {
        $queue.splice($currentStatus.queue_position+1, 0, song)
    }
    function addEnd(event) {
        $queue.splice($queue.length, 0, song)
    }
    function edit(event) {

    }
</script>

<div class="flex flex-row rounded-xl bg-nord3 hover:bg-nord2 w-full p-2 my-1">
	<img src={song.album_art} alt="Placeholder for Album Art" class="ml-2 rounded-lg h-16 w-16" />
	<div class="flex flex-col self-center">
		<span class="ml-4 w-80 self-center">{song.title}</span>
		<span class="ml-4 w-80 self-center text-slate-400">{song.album}</span>
	</div>
    <span class="ml-6 self-center text-slate-300">{song.artist}</span>
	<!--Spacer for Elements-->
	<span class="self-center flex-grow" />
	<span 
    class="p-2 self-center rounded-full hover:bg-nord3" 
    title="Play"
    on:click="{play}"
    >
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
	<span 
    class="p-2 self-center rounded-full hover:bg-nord3" 
    title="Play Next"
    on:click="{addNext}"
    >
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
	<span 
    class="p-2 self-center rounded-full hover:bg-nord3" 
    title="Play At End"
    on:click="{addEnd}"
    >
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
	<span 
    class="p-2 self-center rounded-full hover:bg-nord3" 
    title="Edit Metadata"
    on:click="{edit}"
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
			<path
				d="M14.06 9l.94.94L5.92 19H5v-.92L14.06 9m3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
				fill="currentColor"
			/>
		</svg>
	</span>
</div>
