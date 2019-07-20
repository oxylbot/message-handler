const superagent = require("superagent");

module.exports = {
	async run(ctx) {
		console.log("Args", ctx.args);
		const user = ctx.args[0] || await ctx.gatewayRequest().discord().users().get(ctx.authorID);
		console.log("User", user);

		const basename = user.avatar ?
			`${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}` :
			`${parseInt(user.discriminator) % 5}.png`;

		const avatarURL = user.avatar ?
			`https://cdn.discordapp.com/avatars/${user.id}/` +
				`${basename}?size=1024` :
			`https://cdn.discordapp.com/embed/avatars/${basename}`;

		const { body: avatar } = await superagent.get(avatarURL);
		await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelID,
			content: "",
			file: {
				name: basename,
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
