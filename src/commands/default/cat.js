const path = require("path");
const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		const { body: { file } } = await superagent.get("https://aws.random.cat/meow");
		const { body: buffer } = await superagent.get(file);

		await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelID,
			content: "",
			file: {
				name: path.basename(file),
				file: buffer
			}
		});
	},
	description: "Get a cat picture from <https://random.cat>"
};
