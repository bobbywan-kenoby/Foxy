const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const https = require('https');

const get_data = async (url) => {
	return new Promise((resolve) => {
		let data = '';

		https.get(url, res => {
			res.on('data', chunk => { data += chunk; });
			res.on('end', () => {
				resolve(data);
			});
		});
	});
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fox')
		.setDescription('send a fox image'),
	async execute(interaction) {
		const json = await get_data('https://randomfox.ca/floof/');
		const image_url = JSON.parse(json)['image'];

		const embed = new EmbedBuilder()
			.setTitle(':fox: | **here is your random fancy fox**')
			.setImage(image_url)
			.setTimestamp(new Date());

		interaction.reply({ embeds: [embed] });
	},
};