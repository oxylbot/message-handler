const path = require("path");
const superagent = require("superagent");
const { convert: { toCodePoint } } = require("twemoji");

module.exports = {
	async run(ctx) {
		let file;
		const [, name, id] = ctx.args[0].match(/<:([a-z0-9-_]{2,32}):(\d{17,21})>/i) || [null, null, null];

		if(name && id) {
			file = `https://cdn.discordapp.com/emojis/${id}.png`;
		} else {
			const codepoint = toCodePoint(ctx.args[0]);
			file = `https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/${codepoint}.png`;
		}

		try {
			const { body: buffer } = await superagent.get(file);
			await ctx.bucket.request("createChannelMessage", {
				channelId: ctx.channelID,
				content: "",
				file: {
					name: path.basename(file),
					file: buffer
				}
			});
		} catch(err) {
			await ctx.bucket.request("createChannelMessage", {
				channelId: ctx.channelID,
				content: "Error fetching emoji"
			});
		}
	},
	aliases: ["e", "emoji"],
	description: "Enlarge an emoji",
	args: [{ type: "text" }]
};
