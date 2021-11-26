<script context="module">
	export const ssr = false;
</script>

<script>
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { currentStatus, queue } from '../../stores/store';
	import QueueListItem from '$lib/ui/QueueListItem.svelte';
	let sortable;
	onMount(() => {
		sortable = new Sortable(document.getElementById('queue'), {
			handle: '.draggable-handle',
			filter: '.border-2',
			onUpdate: (event) => {
				// Move item as per order into queue.

				let moved_item = $queue.splice(event.oldIndex, 1)[0];
				$queue.splice(event.newIndex, 0, moved_item);
				if (
					event.oldIndex > $currentStatus.queue_position && // Item was after current position.
					event.newIndex <= $currentStatus.queue_position // Item is now before current position.
				) {
					// Currently Playing song has shifted down the queue.
					$currentStatus.queue_position++;
				} else if (
					event.oldIndex < $currentStatus.queue_position && // Item was before current position.
					event.newIndex >= $currentStatus.queue_position // Item is now after current position.
				) {
					// Currently Playing song has shifted up the queue.
					$currentStatus.queue_position--;
				} else {
					// Item was not moved.
					// Do nothing.
				}
				// Reactivity markers.
				$currentStatus = $currentStatus;
				$queue = $queue;
			}
		});
	});
</script>

<div
	id="queue"
	class="flex flex-wrap content-evenly justify-center w-[92vw] mx-auto py-4 select-none text-nord5"
>
	{#each $queue as s, i (s.title + i)}
		<QueueListItem song={s} counter={i} />
	{:else}
		<!-- empty list -->
	{/each}
</div>
