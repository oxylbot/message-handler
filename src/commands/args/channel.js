module.exports = async (ctx, arg, input) => {
	const [, matchedId] = input.match(/<#(\d{17,21})>/) || [undefined, undefined];
	if(matchedId) input = matchedId;

	if(!("channels" in ctx.cache)) {
		ctx.logger.debug(`Getting guild channels for ${ctx.guildId}`);
		const resp = await ctx.bucket.request("getGuildChannels", {
			guildId: ctx.guildId
		});

		ctx.cache.channels = resp.channels;
	}

	const channel = ctx.cache.channels.find(({ id, name }) => id === input || name === input);
	ctx.logger.verbose("Resolved channel", {
		channel,
		input,
		channels: ctx.cache.channels
	});

	if(channel) return channel;
	else throw new Error("Channel not found");
};
