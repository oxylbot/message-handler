const path = require("path");
const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		const { body: author } = await superagent.get(`/${ctx.authorID}`);

		await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelID,
			content: "",
			file: {
				name: path.basename(file),
				file: buffer
			}
		});
	},
	description: "Get an avatar of a user",
	args: [{
		type: "user",
		optional: true
	}]
};
