const prefixRegex = "^((?:<@!?{{id}}>|oxyl),?\s*\s|o(?:xyl)?!{{custom}})(.+)$"
	.replace("{{id}}", process.env.BOT_ID);

module.exports = async (message, commandSocket) => {
	// TODO get the server prefix (if it exists)
	const serverPrefix = undefined;
	const prefix = new RegExp(prefixRegex
		.replace("{{custom}}", serverPrefix ?
			`|${serverPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}` :
			""),
	"i");

	const [, command] = message.match(prefix) || [null, null];
	if(command) {
		commandSocket.send({
			id: message.id,
			channelID: message.channelID,
			authorID: message.authorID,
			guildID: message.guildID,
			command
		});
	}

	return true;
};
