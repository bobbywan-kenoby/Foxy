const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { autofox } = require(process.cwd() + '/src/Autofox.js');
const { save } = require(process.cwd() + '/src/SaveData.js');
const { client } = require(process.cwd() + '/src/discordClient.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autofox')
		.setDescription('Send foxes images to a specific channel daily')
		.addSubcommand(subcommand =>
			subcommand
				.setName('start')
				.setDescription('start autofox')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The channel to put foxes (by default chose the channel where command are execute)'))
				.addStringOption(option =>
					option.setName('time')
						.setDescription('when send fox on channel example: 8:30 for sending fox at 8:30am and 20:30 for 8:30pm')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('stop')
				.setDescription('stop autofox')),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'start') {
			// get command args
			const channel = interaction.options.getChannel('channel') ?? client.channels.cache.get(interaction.channelId);
			const time = interaction.options.getString('time');

			try {
				autofox.addTask(channel, time);
				save.save();
				await interaction.reply(`autofox is configure enjoy your daily fox in ${channel.name} at ${time} !`);
			} catch (error) {
				console.log(error);
				// parse error
				await interaction.reply('You set a wrong time !\nplease follow this example: 8:30 for sending fox at 8:30am and 20:30 for 8:30pm');
			}
		} else if (interaction.options.getSubcommand() === 'stop') {

			if (autofox.tasks.length < 1) {
				await interaction.reply({
					content: 'no autofox is register in this server',
				});
				return ;
			}

			const button = autofox.tasks.map((t, i) => {
				return new ButtonBuilder()
					.setCustomId(`${i}`)
					.setLabel(`${t.channel.name} at ${t.time[0]}:${t.time[1]}`)
					.setStyle(ButtonStyle.Primary);
			});

			const row = new ActionRowBuilder()
				.addComponents(...button);


			const response = await interaction.reply({
				content: 'which autofox do you want to stop ?',
				components: [row],
			});

			const collectorFilter = i => i.user.id === interaction.user.id;

			try {
				const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
				const task = autofox.tasks[Number(confirmation.customId)];

				autofox.removeTask(Number(confirmation.customId));
				save.save();
				await confirmation.update({ content: `autofox in ${task.channel.name} at ${task.time[0]}:${task.time[1]} successfully remove`, components: [] });
			} catch (e) {
				await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
			}
		}
	},
};
