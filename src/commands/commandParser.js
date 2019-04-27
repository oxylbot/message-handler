const fs = require("fs").promises;
const path = require("path");

const Command = require("./Command");

const commands = new Map();
const commandRegex = /(\w+)(?:\s+|$)(.+)?/i;

module.exports = async ctx => {
	const [, command, args] = commandRegex.exec(ctx.strippedContent) || [null, null, null];
	if(command === null) return;

	ctx.command = command;
	ctx.rawArgs = args;

	if(commands.has(ctx.command)) commands.get(ctx.command).run(ctx);
};


const commandTypes = ["default"];
module.exports.registerCommands = async () => {
	commands.clear();

	for(const commandType of commandTypes) {
		const commandFolder = path.resolve(__dirname, commandType);

		for(const commandFile of await fs.readdir(commandFolder, { encoding: "utf8" })) {
			const commandData = require(path.resolve(commandFolder, commandFile));
			commandData.name = path.basename(commandFile, path.extname(commandFile));
			commandData.type = commandType;

			const command = new Command(commandData);
			command.aliases.concat(command.name).forEach(commandAlias => {
				commands.set(commandAlias, command);
			});
		}
	}
};
