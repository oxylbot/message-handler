module.exports = async (ctx, arg, input) => {
	console.log("Resolving user...");
	const [, id] = input.match(/<@!?(\d{15,21})>/) || [undefined, undefined];
	if(id || /\d{15,21}/.test(input)) {
		console.log("Mentions or is ID");
		try {
			return await ctx.gatewayRequest().discord().users().get(id);
		} catch(err) {
			console.log("Gateway request errored");
			if(err.resp.status === 404) throw new Error("User not found");
			else throw err;
		}
	} else {
		let discrim = false;

		if(input.includes("#")) {
			console.log("Has a #, should be user#0000");
			const index = input.lastIndexOf("#");
			discrim = input.substring(index + 1);
			input = input.substring(0, index);
			if(isNaN(discrim) || discrim.length !== 4) discrim = false;
		}

		let user;
		if(discrim) {
			console.log("Searching by name & discrim");
			[user] = await ctx.gatewayRequest().discord().users().query({
				name: input,
				discriminator: discrim
			});
		} else {
			console.log("Searching by name");
			[user] = await ctx.gatewayRequest().discord().users().query("name", input);
		}

		if(user) return user;
		else throw new Error("User could not be resolved");
	}
};
