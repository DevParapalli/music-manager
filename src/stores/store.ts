import { browser, dev } from '$app/env';
import { writable } from 'svelte/store';


export const pageTitle = writable<string>('Music Thingy');

export interface Source {
	src: string;
	type: string;
}

export interface Song {
	title: string;
	artist: string;
	album: string;
	album_art: string;
	parsed: boolean;
	source: {
		type: string;
		sources: Source[];
	};
}

export interface State extends Song {
	current_time: number;
	queue_position: number;
	is_playing: boolean;
	update: string;
}

export const currentStatus = writable<State>(null);

const initialState = <State>{
	title: 'Load Track to Begin Playback',
	artist: '',
	album: '',
	album_art: '/defaults/default_song_image.svg',
	source: {
		type: 'audio',
		sources: [
			{
				src: '/404.mp3',
				type: 'audio/mp3'
			}
		]
	},
	current_time: 0,
	queue_position: -1,
	is_playing: false,
	update: ''
};

export const queueEndedState = <State>{
	title: 'Queue has ended.',
	artist: '',
	album: '',
	album_art: '',
	source: {
		type: 'audio',
		sources: [
			{
				src: '/404.mp3',
				type: 'audio/mp3'
			}
		]
	},
	current_time: 0,
	//queue_position: -1, // Removed so it doesn't override the queue position
	is_playing: false,
	update: ''
};

if (browser) {
	const storedStatus = JSON.parse(localStorage.getItem('currentStatus'));
	if (storedStatus != null) {
		currentStatus.set(storedStatus);
	} else {
		currentStatus.set(initialState);
	}
}

export const songs = writable<Array<Song>>([]);

const sampleSongs = <Array<Song>>[
	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/0niL3BMZyeU.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/5eu_fkIbmxc.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/6lqLLzgCyEY.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/al4uV5csoPg.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/ccjaiX7Aatk.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/FjoPl1McGTo.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/GxsjjOJrEX0.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/mkfIc0arbCY.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/nVfGLSmXpnY.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/RQV96Bxsxsw.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/tmbfT7-tZiM.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/vw0tGlI5Nt8.mp3',
					type: 'audio/mp3'
				}
			]
		}
	},

	{
		parsed: false,
		source: {
			type: 'audio',
			sources: [
				{
					src: '/zO9AELJfIpg.mp3',
					type: 'audio/mp3'
				}
			]
		}
	}
];

if (browser) {
	const storedSongs = JSON.parse(localStorage.getItem('songs'));
	if (storedSongs != null) {
		songs.set(storedSongs);
	} else {
		songs.set(sampleSongs);
	}
	if (dev) {
		songs.set([]);
	}
}

export const queue = writable<Array<Song>>([]);

const sampleQueue = <Array<Song>>[];

if (browser) {
	const storedQueue = JSON.parse(localStorage.getItem('queue'));
	if (storedQueue != null) {
		queue.set(storedQueue);
	} else {
		queue.set(sampleQueue);
	}
}

export const ScanList = writable<Array<string>>([]);

