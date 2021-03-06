const resolver = require("./resolver");

module.exports = async (command, ctx) => {
	const regex = /(["'])(\\?.)*?\1|[^\s]+/g;
	const args = [];

	for(let i = 0; i < command.args.length; i++) {
		const commandArg = command.args[i];
		let [arg] = regex.exec(ctx.rawArgs) || [null];
		if(i === command.args.length - 1 && arg !== null) arg += ctx.rawArgs.substring(regex.lastIndex);
		if(arg !== null && arg.startsWith("\"") && arg.endsWith("\"")) arg = arg.slice(1, -1);
		if(arg !== null && commandArg.lowercase) arg = arg.toLowerCase();

		const expected = commandArg.label === commandArg.type ?
			commandArg.label :
			`${commandArg.label} as ${commandArg.type}`;

		if(arg === null && commandArg.default !== undefined) {
			arg = commandArg.default;
		} else if(arg === null && commandArg.optional) {
			continue;
		} else if(arg === null) {
			throw new Error(`Missing argument #${i + 1}; expected ${expected}`);
		} else {
			try {
				arg = await resolver[commandArg.type](ctx, commandArg, arg);
			} catch(err) {
				throw new Error(`__Error resolving argument #${i + 1}__ (expected ${expected})\n${err.message}`);
			}
		}

		args.push(arg);
	}

	return args;
};
