const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const { config, get_data } = require(process.cwd() + '/utils.js');
const { client } = require(process.cwd() + '/discordClient.js');

const initTasks = () => {
	config['crontask'].filter(taskConfig => {
		const validate = testTime(taskConfig['time']);
		if (!validate) console.log(`${taskConfig} will be suppr because of wrong task time`);
		return validate;
	});
	return config['crontask'].map(taskConfig => {
		return createTask(taskConfig);
	});
};

const testTime = (timeConfig) => {
	const time = timeConfig.split(':');
	return cron.validate(`${time[1]} ${time[0]} * * *`);
};

const createTask = (task) => {
	const time = task['time'].split(':');
	return { 'task': cron.schedule(`${time[1]} ${time[0]} * * *`, async () => {
		const json = await get_data('https://randomfox.ca/floof/');
		const image_url = JSON.parse(json)['image'];
		const embed = new EmbedBuilder()
			.setTitle(':fox: | **here is your random daily fancy fox**')
			.setImage(image_url)
			.setTimestamp(new Date());

		console.log('perform cron task');
		const channel = client.channels.cache.get(task['channelId']);
		channel.send({ embeds: [embed] });
	}, { timezone: 'Europe/Paris' }), 'id': task['channelId'] };
};

const stopTask = (task) => {
	const test = tasks.filter(t => t['id'] == task['channelId']);
	if (test.length == 0) {
		console.log('this task doesn\'t exist');
	} else {
		tasks.indexOf(test[0])['task'].stop();
	}
};

const removeTask = (task) => {
	const test = tasks.filter(t => t['id'] == task['channelId']);
	if (test.length == 0) {
		console.log('this task doesn\'t exist');
	} else {
		const taskIdx = tasks.indexOf(test[0]);
		tasks[taskIdx]['task'].stop();
		tasks.splice(taskIdx, 1);
	}
};

const tasks = initTasks();

module.exports = { tasks, createTask, stopTask, removeTask, testTime };