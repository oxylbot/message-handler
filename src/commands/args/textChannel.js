module.exports = async (ctx, arg, input) => {
	const [, id] = input.match(/<#(\d{17,21})>/) || [undefined, undefined];
	if(id) input = id;

	if(!("channels" in ctx.cache)) {
		const resp = await ctx.bucket.request("getGuildChannels", {
			guildId: ctx.guildId
		});

		ctx.cache.channels = resp.channels;
	}

	const channel = ctx.cache.channels
		.filter(({ type }) => type === 0)
		.find(({ id, name }) => id === input || name === input);

	if(channel) return channel;
	else throw new Error("Text channel not found");
};
