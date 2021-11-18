import { browser} from '$app/env';
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
}

export const sampleState = <State>{
	title: 'Wounds',
	artist: 'Papa Khan',
	album: 'Wounds - NCS',
	album_art:
		'data:image/jpeg;base64,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',
	source: {
		type: 'audio',
		sources: [
			{
				src: '/Papa Khan - Wounds [NCS Release].mp3',
				type: 'audio/mp3'
			}
		]
	},
	current_time: 0,
	queue_position: 0,
	is_playing: true,
};

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
};

export const currentStatus = writable<State>(initialState);

if (browser) {
	const storedStatus = JSON.parse(localStorage.getItem('currentStatus'));
	if (storedStatus != null) {
		currentStatus.set(storedStatus);
	} else {
		currentStatus.set(initialState);
	}
	currentStatus.subscribe((cs) => localStorage.setItem('currentStatus', JSON.stringify(cs)));
}


export const Queue = writable<Array<Song>>([]);

export const sampleQueue = <Array<Song>>[
	{
		title: 'Papa Khan - Wounds [NCS Release]',
		artist: 'Papa Khan',
		album: 'Wounds',
		album_art:
			'data:image/jpeg;base64,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',
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
		title: 'Elektronomia & RUD - Rollercoaster [NCS Release]',
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
		title: 'Different Heaven & EH!DE - My Heart [NCS Release]',
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
		title: 'STAR SEED- Cayenne (feat. Zoe Moon) [NCS Release]',
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
	}
];

if (browser) {
	const storedQueue = JSON.parse(localStorage.getItem('Queue'));
	if (storedQueue != null) {
		Queue.set(storedQueue);
	}
	else {
		Queue.set(sampleQueue);
	}
	Queue.subscribe((q) => localStorage.setItem('Queue', JSON.stringify(q)));
}
