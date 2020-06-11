const path = require("path");
const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		const { body: { url: file } } = await superagent.get("https://random.dog/woof.json");
		const { body: buffer } = await superagent.get(file);

		return {
			name: path.basename(file),
			file: buffer
		};
	}
};
