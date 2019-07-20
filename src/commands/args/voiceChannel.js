module.exports = async (ctx, arg, input) => {
	const [, id] = input.match(/<#(\d{15,21})>/) || [undefined, undefined];
	if(id || /\d{15,21}/.test(input)) {
		try {
			const channel = await ctx.gatewayRequest().discord().guilds().get(ctx.guildID).channels().get(id);

			if(channel.type !== 2) throw new Error("Channel is not a voice channel");
			else return channel;
		} catch(err) {
			if(err.resp.status === 404) throw new Error("Channel not found");
			else throw err;
		}
	} else {
		const [channel] = await ctx.gatewayRequest().discord().guilds().get(ctx.guildID).channels().query({ name: input });

		if(!channel) throw new Error("Could not resolve channel");
		else if(channel.type !== 0) throw new Error("Channel is not a voice channel");
		else return channel;
	}
};
