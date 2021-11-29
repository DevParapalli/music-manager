import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
			sass: true,

			scss: {
				prependData: '@import "src/variables.scss";'
			}
		})
	],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		ssr: false,

		adapter: adapter({
			pages: 'build',
			assets: 'build',
		}),

		vite: {
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: '@import "src/variables.scss";'
					}
				},
				ssr: {
					noExternal: true
				}
			}
		}
	}
};

export default config;
