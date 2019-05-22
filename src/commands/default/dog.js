const path = require("path");
const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		const { body: { url: file } } = await superagent.get("https://random.dog/woof.json");
		const { body: buffer } = await superagent.get(file);

		console.log("packet", {
			channelId: ctx.channelID,
			file: {
				name: path.basename(file),
				file: buffer
			}
		});
		await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelID,
			file: {
				name: path.basename(file),
				file: buffer
			}
		});
	},
	description: "Get a cat picture from <https://random.dog>"
};
