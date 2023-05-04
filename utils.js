const https = require('https');
const fs = require('node:fs');

const configFile = process.cwd() + '/config.json';

const config = fs.existsSync(configFile) ? (() => {
	const obj = require(configFile);
	console.log('load config ', obj);
	return obj;
})() : { 'crontask': [] };

const configSave = () => {
	console.log(config);
	try {
		fs.writeFileSync(configFile, JSON.stringify(config), 'utf8');
	} catch (err) {
		console.error(err);
	}
};

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

module.exports = { config, get_data, configSave };