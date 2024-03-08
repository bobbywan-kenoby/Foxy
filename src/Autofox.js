const cron = require('node-cron');
const { get_data } = require(process.cwd() + '/src/utils.js');
const { EmbedBuilder } = require('discord.js');
const { client } = require(process.cwd() + '/src/discordClient.js');

class Task {
	constructor(channel, time) {
		this.channel = channel;
		this.time = time.split(':');
		this.status = null;
		this.task = null;
		if (!cron.validate(`${this.time[1]} ${this.time[0]} * * *`)) {
			throw new Error('invalid time');
		}
		this.create();
	}

	create() {
		this.status = "running";
		this.task = cron.schedule(`${this.time[1]} ${this.time[0]} * * *`, async () => {
			const embed = new EmbedBuilder()
				.setTitle(':fox: | **here is your random daily fancy fox**')
				.setImage(JSON.parse(await get_data('https://randomfox.ca/floof/'))['image'])
				.setTimestamp(new Date());

			console.log('perform cron task');
			this.channel.send({ embeds: [embed] });
		}, { timezone: 'Europe/Paris' });
	}

	stop() {
		this.status = "stop";
		this.task.stop();
	}

	remove() {
		this.status = null;
		this.task.stop();
		this.task = null;
	}

	toJSON() {
		return { "channel":this.channel.id,"time":`${this.time[0]}:${this.time[1]}` };
	}
}

class Autofox {
	constructor() {
		this.tasks = [];
	}

	load(tasks) {
		tasks.forEach(element => {
			const channel = client.channels.cache.get(element.channel);
			this.addTask(channel, element.time);
		});
	}

	addTask(channel, time) {
		try {
			const task = new Task(channel, time);
			this.tasks.push(task);
		} catch (error) {
			// send discord message for notify error
			console.error(error);
			throw new Error('invalid time');
		}
	}

	removeTask(id) {
		this.tasks[id].remove();
		this.tasks.splice(id, 1);
	}

	toJSON() {
		return this.tasks.map(t => t.toJSON());
	}
}

const autofox = new Autofox();

module.exports = { autofox };