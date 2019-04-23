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

	const [,, command] = message.content.match(prefix) || [null, null, null];
	if(command) {
		commandSocket.send({
			id: message.id,
			channelId: message.channelId,
			authorId: message.authorId,
			guildId: message.guildId,
			command
		});
	}

	return true;
};
