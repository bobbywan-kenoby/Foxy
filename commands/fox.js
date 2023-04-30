const Canvas = require('canvas');
const Discord = require('discord.js');
const https = require('https');

module.exports = {
	name: 'fox',
	description: 'send a fox image !',
	execute(message) {
		console.time('get')
		https.get('https://randomfox.ca/floof/', (res) => {
			// console.log('statusCode:', res.statusCode);
			// console.log('headers:', res.headers);
			res.on('data', (d) => {
				console.timeEnd('get')
				console.time('parse')
				let url = JSON.parse(d)['image']
				console.timeEnd('parse');

				console.time('load')
				Canvas.loadImage(url).then(image => {
					console.timeEnd('load')

					console.time('message')
					let canvas = Canvas.createCanvas(image.width, image.height)
					let ctx = canvas.getContext("2d")

					ctx.drawImage(image, 0, 0)

					let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "foxPicture.png");
					message.channel.send(':fox: | **here is your random fancy fox**', attachment);

					console.timeEnd('message')
				}).catch(err => {
					console.log(err);
				})
			});
		})
	}
}