<div class="slide-container">
	<input type="range" min="1" max="100" value="50" class="slider bg-nord3 rounded-xl" id="volume-slider" />
</div>

<style>
.slider::-webkit-slider-thumb {
  @apply border-2 rounded-lg shadow-sm border-nord10 h-3 w-3 bg-nord15 cursor-pointer;
}
.slider::-moz-range-thumb {
  @apply border-2 rounded-lg shadow-sm border-nord10 h-3 w-3 bg-nord15 cursor-pointer;
}
.slider::-webkit-slider-runnable-track {
  @apply bg-nord3;
}
.slider::-moz-range-track {
  @apply bg-nord3;
}
</style>
