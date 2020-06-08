module.exports = {
	async run(ctx) {
		const now = Date.now();
		const msg = await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelId,
			content: `Pong!`
		});

		await ctx.bucket.request("editMessage", {
			channelId: ctx.channelId,
			messageId: msg.id,
			content: `Pong! ${Date.now() - now}ms`
		});

		return;
	}
};
