const { SlashCommandBuilder } = require('discord.js');
const { config } = require(process.cwd() + '/utils.js');
const { tasks, createTask, testTime, removeTask } = require(process.cwd() + '/cronTask.js');
const { client } = require(process.cwd() + '/discordClient.js');

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
			// get command args
			const channel = interaction.options.getChannel('channel') ?? client.channels.cache.get(interaction.channelId);
			const time = interaction.options.getString('time');

			// test if time was correct
			if (testTime(time)) {
				// detect if task already register
				const taskConfig = config['crontask'].filter(e => e['channelId'] == channel.id);
				let task = null;
				if (taskConfig.length == 0) {
					// task not find => create task
					task = { 'channelId': channel.id, 'time': time };
					config['crontask'].push(task);
					console.log(`channel ${channel.name} register at ${time}`);
				} else {
					// task find => update time
					const configIdx = config['crontask'].indexOf(taskConfig[0]);
					config['crontask'][configIdx]['time'] = time;
					task = config['crontask'][configIdx];
					// remove task for recreate it
					removeTask(task);
					console.log(`change time to ${time} for ${channel.name}`);
				}
				tasks.push(createTask(task));
				await interaction.reply(`autofox is configure enjoy your daily fox in ${channel.name} at ${time} !`);
			} else {
				await interaction.reply('You set a wrong time !\nplease follow this example: 8:30 for sending fox at 8:30am and 20:30 for 8:30pm');
			}
		} else if (interaction.options.getSubcommand() === 'stop') {
			const channel = interaction.options.getChannel('channel') ?? client.channels.cache.get(interaction.channelId);
			const taskConfig = config['crontask'].filter(e => e['channelId'] == channel.id);
			if (taskConfig.length == 0) {
				await interaction.reply(`autofox wasn't configure in the channel ${channel.name}`);
			} else {
				const configIdx = config['crontask'].indexOf(taskConfig[0]);
				const task = config['crontask'][configIdx];
				removeTask(task);
				config['crontask'].splice(configIdx, 1);
				console.log('task suppress successfully');
				await interaction.reply(`autofox will no longer send fox in the channel ${channel.name}`);
			}
		}
	},
};
