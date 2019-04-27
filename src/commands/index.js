const commandParser = require("./commandParser");
const prefixRegex = {
	development: `^((?:<@!?{{id}}>|oxyla),?\s*\s|o(?:xyl)?a!{{custom}})(.+)$`,
	staging: `^((?:<@!?{{id}}>|oxylb),?\s*\s|o(?:xyl)?b!{{custom}})(.+)$`,
	production: `^((?:<@!?{{id}}>|oxyl),?\s*\s|o(?:xyl)?!{{custom}})(.+)$`
}[process.env.NODE_ENV].replace("{{id}}", process.env.BOT_ID);

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
