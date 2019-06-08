const argParser = require("./args/parser");
const gatewayRequest = require("../gatewayRequests");

class Command {
	constructor(command) {
		if(!command.name) throw new Error("Command has no name");
		else if(!command.run) throw new Error(`Command ${command.name} must have a run function`);
		else if(!command.description) console.warn(`Command ${command.name} has no description`);

		this.name = command.name;
		this.type = command.type;
		this.description = command.description;

		this.aliases = command.aliases || [];
		this.guildOnly = !!command.guildOnly;
		this.args = (command.args || []).map(arg => {
			if(typeof arg !== "object") arg = { type: arg };
			if(!arg.label) arg.label = arg.type;

			return arg;
		});

		this.runFunction = command.run;
	}

	async run(ctx) {
		await ctx.bucket.request("triggerTypingIndicator", {
			channelId: ctx.channelID
		});

		if(!ctx.guildID && this.guildOnly) {
			await ctx.bucket.request("createChannelMessage", {
				channelId: ctx.channelID,
				content: "This command only works in guilds"
			});
		}

		ctx.gatewayRequest = gatewayRequest;

		if(this.args.length) {
			try {
				ctx.args = await argParser(this, ctx);
			} catch(err) {
				await ctx.bucket.request("createChannelMessage", {
					channelId: ctx.channelID,
					content: `Error parsing arguments: ${err.message}`
				});
			}
		}

		await this.runFunction(ctx);
	}
}

module.exports = Command;
