module.exports = async (ctx, arg, input) => {
	const [, id] = input.match(/^<#(\d+)(?::(\d+):([^>]+))?>/) || [undefined, undefined];
	if(id || /\d{15,21}/.test(input)) {
		try {
			return await ctx.gatewayRequest().discord().guilds().get(ctx.guildID).channels().get(id);
		} catch(err) {
			if(err.resp.status === 404) throw new Error("Channel not found");
			else throw err;
		}
	} else {
		const [channel] = await ctx.gatewayRequest().discord().guilds().get(ctx.guildID).channels().query({ name: input });

		if(channel) return channel;
		else throw new Error("Could not resolve channel");
	}
};
