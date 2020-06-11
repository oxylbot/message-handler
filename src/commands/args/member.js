const superagent = require("superagent");
const orchestratorURL = `http://shard-orchestrator:${process.env.SHARD_ORCHESTRATOR_SERVICE_PORT}`;

module.exports = async (ctx, arg, input) => {
	const [, id] = input.match(/<@!?(\d{15,21})>/) || [undefined, undefined];
	if(id) input = id;

	if(/\d{15,21}/.test(input)) {
		try {
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

		const { body } = await superagent.get(orchestratorURL)
			.query({
				id: ctx.guildId,
				query: input
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
