const fs = require('node:fs');
const { autofox } = require(process.cwd() + '/src/Autofox.js');

class SaveData {
	constructor() {
		this.saveName = `${process.cwd()}/data/save.json`;
		this.load(this.saveName);
	}

	load(file) {
		this.data = fs.existsSync(file) ? (() => {
			const obj = require(file);
			console.log('load config ', obj);
			return obj;
		})() : { crontask: [] };
	}

	update() {
		this.data.crontask = autofox.toJSON();
	}

	save() {
		this.update();
		try {
			fs.writeFileSync(this.saveName, JSON.stringify(this.data), 'utf8');
		} catch (err) {
			console.error(err);
		}
	}
}

const save = new SaveData();

module.exports = { save };