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
	//queue_position: -1, // Removed so it doesnt override the queue position
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
	if (dev) {
		currentStatus.set(initialState);
	}
	currentStatus.subscribe((cs) => localStorage.setItem('currentStatus', JSON.stringify(cs)));
}

export const songs = writable<Array<Song>>([]);

const sampleSongs = <Array<Song>>[
	{
		title: 'Incomplete (Muzzy Remix)',
		artist: 'Aero Chord & Anuka',
		album: 'Incomplete',
		album_art:
			'https://linkstorage.linkfire.com/medialinks/images/2194b46b-3a78-4d9b-a23a-b034497d1f64/artwork-440x440.jpg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/Aero Chord & Anuka - Incomplete (Muzzy Remix) [NCS Release].mp3',
					type: 'audio/mp3'
				}
			]
		}
	},
	{
		title: 'My Heart',
		artist: 'Different Heaven & EH!DE',
		album: 'My Heart',
		album_art:
			'https://linkstorage.linkfire.com/medialinks/images/f0b8179f-0526-4e6e-bf3d-c111095fb7b4/artwork-440x440.jpg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/Different Heaven & EH!DE - My Heart [NCS Release].mp3',
					type: 'audio/mp3'
				}
			]
		}
	},
	{
		title: 'Rollercoaster',
		artist: 'Elektronomia & RUD',
		album: 'Rollercoaster',
		album_art:
			'https://linkstorage.linkfire.com/medialinks/images/388c5987-2e40-4f3a-93a2-30df3447cc9c/artwork-440x440.jpg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/Elektronomia & RUD - Rollercoaster [NCS Release].mp3',
					type: 'audio/mp3'
				}
			]
		}
	},
	{
		title: 'Home',
		artist: 'Mo Falk & OVSKY',
		album: 'Home',
		album_art:
			'https://linkstorage.linkfire.com/medialinks/images/764a0095-e74f-4806-b3e0-15060bd62d15/artwork-440x440.jpg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/Mo Falk & OVSKY - Home [NCS Release].mp3',
					type: 'audio/mp3'
				}
			]
		}
	},
	{
		title: 'Wounds',
		artist: 'Papa Khan',
		album: 'Wounds',
		album_art:
			'https://linkstorage.linkfire.com/medialinks/images/2ee4c2b4-de6a-45db-8ba9-58995239d7d4/artwork-440x440.jpg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/Papa Khan - Wounds [NCS Release].mp3',
					type: 'audio/mp3'
				}
			]
		}
	},
	{
		title: 'Cayenne (feat. Zoe Moon)',
		artist: 'STAR SEED feat. Zoe Moon',
		album: 'Cayenne',
		album_art:
			'https://linkstorage.linkfire.com/medialinks/images/d452e78e-bded-4c57-9fd5-af5386bf2372/artwork-440x440.jpg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/STAR SEED- Cayenne (feat. Zoe Moon) [NCS Release].mp3',
					type: 'audio/mp3'
				}
			]
		}
	},
	{
		title: 'Station 2',
		artist: 'THYKIER',
		album: 'Station 2',
		album_art:
			'https://linkstorage.linkfire.com/medialinks/images/19980735-dd1e-456f-9bb4-759a5dbec445/artwork-440x440.jpg',
		source: {
			type: 'audio',
			sources: [
				{
					src: '/THYKIER - Station 2 [NCS Release].mp3',
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
		songs.set(sampleSongs);
	}
	songs.subscribe((s) => localStorage.setItem('songs', JSON.stringify(s)));
}

export const queue = writable<Array<Song>>([]);

const sampleQueue = <Array<Song>>[];
sampleQueue.push(sampleSongs[6], sampleSongs[1], sampleSongs[2], sampleSongs[4]);

if (browser) {
	const storedQueue = JSON.parse(localStorage.getItem('Queue'));
	if (storedQueue != null) {
		queue.set(storedQueue);
	} else {
		queue.set(sampleQueue);
	}
	if (dev) {
		queue.set(sampleQueue);
	}
	queue.subscribe((q) => localStorage.setItem('Queue', JSON.stringify(q)));
}
