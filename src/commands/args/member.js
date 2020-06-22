const superagent = require("superagent");
const orchestratorURL = `http://shard-orchestrator:${process.env.SHARD_ORCHESTRATOR_SERVICE_PORT}`;

module.exports = async (ctx, arg, input) => {
	const [, id] = input.match(/<@!?(\d{15,21})>/) || [undefined, undefined];
	if(id) input = id;

	if(/\d{15,21}/.test(input)) {
		try {
			ctx.logger.debug(`Requesting member id ${input} from ${ctx.guildId}`);
			return await ctx.bucket.request("getGuildMember", {
				guildId: ctx.guildId,
				userId: input
			});
		} catch(err) {
			throw new Error("Member not found");
		}
	} else {
		let discrim = false;

		if(input.includes("#")) {
			const index = input.lastIndexOf("#");
			discrim = input.substring(index + 1);
			input = input.substring(0, index);
			if(isNaN(discrim)) discrim = false;
		}

		ctx.logger.debug(`Requesting members like ${input} from ${ctx.guildId}`);
		const { body } = await superagent.get(`${orchestratorURL}/request-guild-members`)
			.query({
				id: ctx.guildId,
				query: input
			});
		ctx.logger.verbose(`Members recieved`, {
			members: body,
			input
		});

		let member;
		if(!discrim || body.length === 1) {
			member = body[0];
		} else if(discrim) {
			member = body.find(({ user }) => user.discriminator === discrim);
		}

		if(member) return member;
		else throw new Error("Member not found");
	}
};
