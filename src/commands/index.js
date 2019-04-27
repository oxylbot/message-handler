const commandParser = require("./commandParser");
const prefixRegex = "^((?:<@!?{{id}}>|oxyl),?\s*\s|o(?:xyl)?!{{custom}})(.+)$"
	.replace("{{id}}", process.env.BOT_ID);

module.exports = async (message, bucketClient) => {
	// TODO get the server prefix (if it exists)
	const serverPrefix = undefined;
	const prefix = new RegExp(prefixRegex
		.replace("{{custom}}", serverPrefix ?
			`|${serverPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}` :
			""),
	"i");

	const [,, command] = message.content.match(prefix) || [null, null, null];
	if(command) {
		await commandParser({
			strippedContent: message.command,
			bucket: bucketClient,
			channelID: message.channelId,
			messageID: message.id,
			authorID: message.authorId,
			guildID: message.guildId
		});
	}
};

commandParser.registerCommands();
