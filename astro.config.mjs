import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'hackache',
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{ label: '[ hackache ]', slug: '' },
				{ label: 'Red', slug: 'red', collapsed: true, }
			],
		}),
	],
});