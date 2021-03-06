/* eslint-disable max-depth */
const Listener = require('../Structures/Listener');

const { MessageEmbed } = require('discord.js');

const UpVotesSchema = require('../models/upvotes');
const UserSettingsSchema = require('../models/UserSettings');

module.exports = class extends Listener {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		this.client.on('message', async (message) => {
			const votes = await UpVotesSchema.findOne({
				_id: message.guild.id
			});

			if (votes) {
				if (message.channel.id === votes.channelID) {
					await message.react('<:upvote:737422006525624452>');
					await message.react('<:downvote:737422054533496873>');
					await message.react('❓');
				}
			}
		});

		this.client.on('messageReactionAdd', async (reaction) => {
			const votes = await UpVotesSchema.findOne({
				_id: reaction.message.guild.id
			});

			if (votes) {
				const limit = `${votes.upvotes}`;

				if (reaction.message.channel.id === votes.channelID) {
					if (reaction.emoji.name === 'upvote' && Number(limit) === reaction.count) {
						reaction.message.pin({ reason: `Hit the required upvotes - ${votes.upvotes}` });

						if (votes.ToDoChannelID) {
							const Jump = `https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`;
							const List = this.client.channels.cache.get(votes.get('ToDoChannelID'));
							const { member } = reaction.message;
							const embed = new MessageEmbed()
								.setAuthor(`Popular Suggestion`)
								.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
								.setColor('RANDOM')
								.setDescription(`\`${reaction.message.content}\`\n\n[jump to Message](${Jump})`)
								.setFooter(`Suggestion By: ${member.user.tag}`);

							List.send(embed);

							const UpVotesDms = await UserSettingsSchema.findOne({
								guildID: reaction.message.guild.id,
								userID: member.user.id,
								upvotesdms: 'false'
							});


							if (!UpVotesDms) {
								const { name } = reaction.message.guild;

								const upvoted = new MessageEmbed()
									.setTitle(name)
									.setThumbnail(reaction.message.guild.iconURL())
									.setDescription(`Your suggestion has been added to our view list!`)
									.addFields(
										{ name: 'Suggestion', value: `\`${reaction.message.content}\`\n\n[jump to Message](${Jump})`, inline: true }
									)
									.setColor('RANDOM')
									.setFooter(`You can disable notifications by using ${this.client.prefix}upvotes dms`);

								this.client.users.cache.get(member.user.id).send(upvoted);
							}

							if (UpVotesDms) {
								return;
							}
						}
					}

					if (reaction.emoji.name === 'downvote' && Number(limit) === reaction.count) {
						reaction.message.unpin();
					}

					if (reaction.message.member.id) {
						reaction.users.remove(reaction.message.member.id);
					}
				}
			}
		});

		this.client.on('ready', async () => {
			const Guilds = this.client.guilds.cache.map(guild => guild.id);
			const votes = await UpVotesSchema.findOne({
				_id: Guilds
			});

			if (votes) {
				const channel = this.client.channels.cache.get(votes.get('channelID'));

				channel.messages.fetch({ limit: 30 })
					.then(async messages => {
						messages.forEach(async messagess => {
							if (messagess.partial) await messagess.fetch();
							if (!messagess.guild) return;
						});
					});
			}
		});
	}

};
