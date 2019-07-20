module.exports = async (ctx, arg, input) => {
	const [, id] = input.match(/<@!?(\d{15,21})>/) || [undefined, undefined];
	if(id) {
		try {
			return await ctx.gatewayRequest().discord().users().get(id);
		} catch(err) {
			if(err.resp.status === 404) throw new Error("User not found");
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

		let user;
		if(discrim) {
			[user] = await ctx.gatewayRequest().discord().users().query({
				name: input,
				discriminator: discrim
			});
		} else {
			[user] = await ctx.gatewayRequest().discord().users().query("name", input);
		}

		if(user) return user;
		else throw new Error("User could not be resolved");
	}
};
