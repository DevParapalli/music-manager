import { writable } from 'svelte/store';

export const pageTitle = writable<string>('Music Thingy');

export const currentStatus = writable({
	title: 'Song Title',
	artist: 'List of Artists ?',
	album: 'Album',
	album_art: 'base64_encoded_string==',
	file: '//path/to/file'
});


export const Queue = writable([]);


