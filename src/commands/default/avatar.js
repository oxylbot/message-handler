const superagent = require("superagent");
const orchestratorURL = `http://shard-orchestrator:${process.env.SHARD_ORCHESTRATOR_SERVICE_PORT}`;

module.exports = {
	async run(ctx) {
		const user = ctx.args[0] || (await superagent.get(`${orchestratorURL}/request-guild-members`)
			.query({
				id: ctx.guildId,
				userIds: [ctx.authorId]
			})).user;

		const basename = user.avatar ?
			`${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}` :
			`${parseInt(user.discriminator) % 5}.png`;

		const avatarURL = user.avatar ?
			`https://cdn.discordapp.com/avatars/${user.id}/` +
				`${basename}?size=1024` :
			`https://cdn.discordapp.com/embed/avatars/${basename}`;

		const { body: avatar } = await superagent.get(avatarURL);
		return {
			name: basename,
			file: avatar
		};
	},
	args: [{
		type: "user",
		optional: true
	}]
};
