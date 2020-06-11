const argParser = require("./args/parser");

class Command {
	constructor(command) {
		if(!command.name) throw new Error("Command has no name");
		else if(!command.run) throw new Error(`Command ${command.name} must have a run function`);

		this.name = command.name;
		this.type = command.type;

		this.aliases = command.aliases || [];
		this.guildOnly = !!command.guildOnly;
		this.args = (command.args || []).map(arg => {
			if(typeof arg !== "object") arg = { type: arg };
			if(!arg.label) arg.label = arg.type;

			return arg;
		});

		this.runFunction = command.run;
	}

	get usage() {
		if(!this.args.length) return "";
		return this.args.reduce((usage, arg) => {
			if(usage.length) usage += " ";
			usage += arg.optional ? "[" : "<";
			usage += arg.label;
			usage += arg.optional ? "]" : ">";

			return usage;
		}, "");
	}

	async run(ctx) {
		await ctx.bucket.request("triggerTypingIndicator", {
			channelId: ctx.channelId
		});

		if(!ctx.guildId && this.guildOnly) {
			await ctx.bucket.request("createChannelMessage", {
				channelId: ctx.channelId,
				content: "This command only works in guilds"
			});

			return;
		}

		if(this.args.length) {
			try {
				ctx.args = await argParser(this, ctx);
			} catch(err) {
				await ctx.bucket.request("createChannelMessage", {
					channelId: ctx.channelId,
					content: err.message
				});

				return;
			}
		}

		const result = await this.runFunction(ctx);

		if(result) {
			const data = {
				channelId: ctx.channelId,
				content: "",
				allowedMentions: result.allowedMentions || []
			};

			if(typeof result === "string") {
				data.content = result.trim();
			} else if(result.name && result.file) {
				data.file = {
					name: result.name,
					file: result.file
				};
			} else if(result.file) {
				data.file = result.file;
			}

			if(result.content) data.content = result.content.trim();
			if(result.embed) data.embed = result.embed;

			await ctx.bucket.request("createChannelMessage", data);
		}
	}
}

module.exports = Command;
