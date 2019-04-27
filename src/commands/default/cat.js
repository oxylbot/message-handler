const path = require("path");
const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		const { body: { file } } = await superagent.get("https://aws.random.cat/meow");
		const { body: image } = await superagent.get(file);

		await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelID,
			file: {
				name: path.basename(file),
				file: image
			}
		});
	},
	description: "Get a cat picture from <https://random.cat>"
};
