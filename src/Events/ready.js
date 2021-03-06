/* eslint-disable camelcase */
const Event = require('../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		if (this.client.shard.ids[0] === 0) console.log(`Loaded ${this.client.commands.size} Commands`);
		if (this.client.shard.ids[0] === 0) console.log(`Loaded ${this.client.events.size} Events`);
		if (this.client.shard.ids[0] === 0) console.log(`Loaded ${this.client.listeners.size} Listeners`);

		console.log([
			`${this.client.user.tag} has logged in!`,
			`${this.client.user.tag} is running in ${this.client.guilds.cache.size} Servers.`
		].join('\n'));
		const statuses = [
			`${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} Edawgers!`,
			`play.edawg878.com | -help`
		];

		setInterval(() => {
			const status = statuses[Math.floor(Math.random() * statuses.length)];
			this.client.user.setActivity(status, { type: 'WATCHING' });
		}, 50000);

		// Emojis
		const Guilds = this.client.guilds.cache.map(guild => guild.id);

		Guilds.forEach((guild) => {
			const guilds = this.client.guilds.cache.get(guild);
			const boop = [], animated = [];
			guilds.emojis.cache.forEach(emoji => emoji.animated ? animated.push([emoji.id, emoji.name]) : boop.push([emoji.id, emoji.name]));
		});
	}

};
