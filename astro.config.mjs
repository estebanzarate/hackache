import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Hackache',
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{ label: '[ Hackache ]', slug: '' },
				{ label: 'Metodología', slug: 'metodologia' },
				{
					label: 'Linux',
					collapsed: true,
					items: [
						{ label: 'Enumeration', slug: 'linux/enumeration' },
						{ label: 'Interactive Shell', slug: 'linux/interactive-shell' },
						{ label: 'Linux', slug: 'linux/linux' },
						{ label: 'Port Forwarding', slug: 'linux/port-forwarding' },
						{ label: 'Privilege Escalation', slug: 'linux/privilege-escalation' },
						{ label: 'Reverse Shell', slug: 'linux/reverse-shell' },
						{ label: 'Setup', slug: 'linux/setup' },
						{ label: 'Shells', slug: 'linux/shells' },
						{ label: 'Webshell', slug: 'linux/webshell' },
					],
				},
				{
					label: 'Windows',
					collapsed: true,
					items: [
						{ label: 'Windows', slug: 'windows/windows' },
						{ label: 'Active Directory', slug: 'windows/active-directory' },
						{ label: 'Enumeración', slug: 'windows/enumeracion' },
						{ label: 'Privilege Escalation', slug: 'windows/privilege-escalation' },
						{ label: 'Reverse Shell', slug: 'windows/reverse-shell' },
						{ label: 'File Transfer', slug: 'windows/file-transfer' },
					],
				},
				{
					label: 'Vulnerabilities / Attacks',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'vulnerabilities-attacks/overview' },
					],
				},
				{
					label: 'Databases',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'databases/overview' },
					],
				},
				{ label: 'Blockchain', slug: 'blockchain' },
				{
					label: 'CMS',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'cms/overview' },
					],
				},
				{
					label: 'Cryptography',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'cryptography/overview' },
					],
				},
				{ label: 'Hardware', slug: 'hardware' },
				{ label: 'Payloads', slug: 'payloads' },
				{
					label: 'Programming',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'programming/overview' },
					],
				},
				{ label: 'Resources', slug: 'resources' },
				{ label: 'Reversing', slug: 'reversing' },
				{
					label: 'Services',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'services/overview' },
					],
				},
				{
					label: 'Tools',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'tools/overview' },
					],
				},
				{
					label: 'Various',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'various/overview' },
					],
				},
				{
					label: 'Webservers',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'webservers/overview' },
					],
				},
				{ label: 'Wordlists', slug: 'wordlists' },
				{
					label: 'Hack The Box',
					collapsed: true,
					items: [
						{
							label: 'Academy',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'hack-the-box/academy/overview' }],
						},
						{
							label: 'Challenges',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'hack-the-box/challenges/overview' }],
						},
						{
							label: 'CTF',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'hack-the-box/ctf/overview' }],
						},
						{
							label: 'Machines',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'hack-the-box/machines/overview' }],
						},
						{ label: 'Pro Labs', slug: 'hack-the-box/pro-labs' },
						{
							label: 'Sherlocks',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'hack-the-box/sherlocks/overview' }],
						},
					],
				},
				{ label: 'OverTheWire', slug: 'overthewire' },
				{
					label: 'Vulnyx',
					collapsed: true,
					items: [
						{
							label: 'Machines',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'vulnyx/machines/overview' }],
						},
					],
				},
				{
					label: 'Docker Labs',
					collapsed: true,
					items: [
						{
							label: 'Machines',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'docker-labs/machines/overview' }],
						},
					],
				},
				{
					label: 'The Hackers Labs',
					collapsed: true,
					items: [
						{
							label: 'Machines',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'the-hackers-labs/machines/overview' }],
						},
					],
				},
				{
					label: 'Try Hack Me',
					collapsed: true,
					items: [
						{
							label: 'Machines',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'try-hack-me/machines/overview' }, { label: 'Lookup', slug: 'try-hack-me/machines/lookup' },],
						},
					],
				},
				{
					label: 'Pico CTF',
					collapsed: true,
					items: [
						{
							label: 'Challenges',
							collapsed: true,
							items: [{ label: 'Overview', slug: 'pico-ctf/challenges/overview' }],
						},
					],
				},
			],
		}),
	],
});