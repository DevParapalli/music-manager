<script>
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



<!--Hidden Plyr in layout so we can have non stop playback even while navigating.-->
<div>
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