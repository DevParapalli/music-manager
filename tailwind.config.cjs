const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const nord = require('tailwind-nord')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [forms, typography, nord]
};

module.exports = config;
