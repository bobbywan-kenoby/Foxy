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

module.exports = { get_data };