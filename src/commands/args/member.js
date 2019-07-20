module.exports = async (ctx, arg, input) => {
	const [, id] = input.match(/<@!?(\d{15,21})>/) || [undefined, undefined];
	if(id) {
		try {
			return await ctx.gatewayRequest().discord().guilds().get(ctx.guildID).members().get(id);
		} catch(err) {
			if(err.resp.status === 404) throw new Error("Member not found");
			else throw err;
		}
	} else {
		let discrim = false;

		if(input.includes("#")) {
			const index = input.lastIndexOf("#");
			discrim = input.substring(index + 1);
			input = input.substring(0, index);
			if(isNaN(discrim)) discrim = false;
		}

		let member;
		if(discrim) {
			[member] = await ctx.gatewayRequest().discord().guilds().get(ctx.guildID).members().query({
				name: input,
				discriminator: discrim
			});
		} else {
			[member] = await ctx.gatewayRequest().discord().guilds().get(ctx.guildID).members().query("name", input);
		}

		if(member) return member;
		else throw new Error("Member could not be resolved");
	}
};
