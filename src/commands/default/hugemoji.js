const path = require("path");
const superagent = require("superagent");
const { convert: { toCodePoint } } = require("twemoji");

module.exports = {
	async run(ctx) {
		let file;
		const [, animated, name, id] = ctx.args[0]
			.match(/<(a)?:([a-z0-9-_]{2,32}):(\d{17,21})>/i) || [null, null, null, null];

		if(name && id) {
			file = `https://cdn.discordapp.com/emojis/${id}.${animated ? ".gif" : ".png"}`;
		} else {
			const codepoint = toCodePoint(ctx.args[0]);
			file = `https://raw.githubusercontent.com/twitter/twemoji/gh-pages/v/13.0.0/72x72/${codepoint}.png`;
		}

		try {
			const { body: buffer } = await superagent.get(file);
			return {
				name: path.basename(file),
				file: buffer
			};
		} catch(err) {
			return "Error fetching emote, are you sure you provided a proper emote?";
		}
	},
	aliases: ["e", "emoji"],
	args: [{
		type: "text",
		label: "emoji"
	}]
};
