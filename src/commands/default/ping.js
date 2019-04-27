module.exports = {
	async run(ctx) {
		const now = Date.now();
		const msg = await ctx.bucket.request("createChannelMessage", {
			channelId: ctx.channelID,
			content: `Pong!`
		});

		await ctx.bucket.request("editMessage", {
			channelId: ctx.channelID,
			messageId: msg.id,
			content: `Pong! ${Date.now() - now}ms`
		});
	},
	description: "Test bot latency"
};
