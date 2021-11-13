<script>
    import {current_value} from '../stores/store';
	let bar_val = '10';
    $: current_value.set(bar_val);
</script>

<div class="flex mt-10 justify-evenly w-full">
    <input type="text" class="h-8 text-nord0" bind:value={bar_val} />
</div>
