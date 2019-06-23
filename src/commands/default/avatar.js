const path = require("path");
const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		console.log(ctx.args);
		const user = ctx.args[0] || await ctx.gatewayRequest().discord().users().get(ctx.authorID);
		const avatarURL = user.avatar ?
			`https://cdn.discordapp.com/avatars/${user.id}/` +
				`${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=1024` :
			`https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;

		console.log(avatarURL);
		const { body: avatar } = await superagent.get(avatarURL);
		await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelID,
			content: "",
			file: {
				name: path.basename(avatarURL),
				file: avatar
			}
		});
	},
	description: "Get an avatar of a user",
	args: [{
		type: "user",
		optional: true
	}]
};
