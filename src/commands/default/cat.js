const path = require("path");
const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		const { body: { file } } = await superagent.get("https://aws.random.cat/meow");
		const { body: buffer } = await superagent.get(file);

		return {
			name: path.basename(file),
			file: buffer
		};
	}
};
