const { Collection, Events } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const process = require('node:process');
const { client } = require(process.cwd() + '/src/discordClient.js');
const { autofox } = require(process.cwd() + '/src/Autofox.js');
const { save } = require(process.cwd() + '/src/SaveData.js');

// Command handling
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, () => {
	console.log('bot connected');
	autofox.load(save.data.crontask);
});

client.login(process.env.token);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;

	const re = new RegExp('(.*)([a-z]*://)([a-z]*.[a-z]*)(.*)');
	if (!re.exec(message.content)) return;

	const fixTwitter = (text) => {
		const test = re.exec(text);
		if (test && ['x.com', 'twitter.com'].find(e => e === test[3])) {
			test[3] = 'fxtwitter.com';
			return test.slice(1).join('');
		}
		return text;
	};
	const newMessage = String(message.content).split('\n').reduce((acc, line) => {
		return acc + line.split(' ').map(str => fixTwitter(str)).join(' ');
	}, '');

	const channel = client.channels.cache.get(message.channelId);
	channel.send(`correct link : ${newMessage}`);
});