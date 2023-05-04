const { SlashCommandBuilder } = require('discord.js');
const { config } = require(process.cwd() + '/utils.js');
const { tasks, createTask, testTime, removeTask } = require(process.cwd() + '/cronTask.js');

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
				.setDescription('stop autofox')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The channel You to stop puting foxes'))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'start') {
			const channelId = interaction.options.getUser('channel') ?? interaction.channelId;
			const time = interaction.options.getString('time');
			if (testTime(time)) {
				const channel = config['crontask'].filter(e => e['channel'] == channelId);
				let task = null;
				if (channel.length == 0) {
					task = { 'channel': interaction.channelId, 'time': time };
					config['crontask'].push(task);
					console.log('channel register');
				} else {
					config['crontask'][config['crontask'].indexOf(channel[0])]['time'] = time;
					task = config['crontask'][config['crontask'].indexOf(channel[0])];
					removeTask(task);
					console.log(`change time to ${time}`);
				}
				tasks.push(createTask(task));
				await interaction.reply('autofox is configure enjoy your daily fox !');
			} else {
				await interaction.reply('You set a wrong time !\nplease follow this example: 8:30 for sending fox at 8:30am and 20:30 for 8:30pm');
			}
		} else if (interaction.options.getSubcommand() === 'stop') {
			const channelId = interaction.options.getUser('channel') ?? interaction.channelId;
			const channel = config['crontask'].filter(e => e['channel'] == channelId);
			if (channel.length == 0) {
				await interaction.reply('autofox wasn\'t configure in this channel');
			} else {
				const configIdx = config['crontask'].indexOf(channel[0]);
				const task = config['crontask'][configIdx];
				removeTask(task);
				config['crontask'].splice(configIdx, 1);
				console.log('task suppress successfully');
				await interaction.reply('autofox will no longer send fox in this channel');
			}
		}
	},
};
