/// <reference lib="WebWorker" />
declare const self: ServiceWorkerGlobalScope;

import { build, files, timestamp } from '$service-worker';

// Cache can be rotated and invalidated when new deployment is done.
const cacheName = `cache-${timestamp}`;

// Caching all built files, will use cache-first-network-fallback strategy.
const cacheFiles = [...build, ...files];

// Styles for console.log()
const consoleStyle = 'color: pink; font-weight: bold; background-color:black;';

// Installing Service Worker.
self.addEventListener('install', (event: ExtendableEvent) => {
	console.log('%c [service-worker] Install', consoleStyle);
	event.waitUntil(
		caches.open(cacheName).then((cache) => {
			console.log('%c [service-worker] Pre-caching all files. ', consoleStyle);
			return cache.addAll(cacheFiles);
		})
	);
	self.skipWaiting();
});

// Clear Old Caches when new deployment is done.
self.addEventListener('activate', (event: ExtendableEvent) => {
	console.log('%c [service-worker] Activate ', consoleStyle);
	event.waitUntil(
		caches.keys().then((oldCacheNames) => {
			return Promise.all(
				oldCacheNames.map((oldCache) => {
					if (oldCache !== cacheName) {
						console.log(`%c [service-worker] Removing old cache ${oldCache} `, consoleStyle);
						return caches.delete(oldCache);
					}
				})
			);
		})
	);
	self.clients.claim();
});

// Cache First Network Fallback Strategy.
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
