const resolver = require("./resolver");

module.exports = async (command, ctx) => {
	const regex = /(["'])(\\?.)*?\1|[^\s]+/g;
	const args = [];

	for(let i = 0; i < command.args.length; i++) {
		const commandArg = command.args[i];
		let [arg] = regex.exec(ctx.rawArgs) || [null];
		if(arg.startsWith("\"") && arg.endsWith("\"")) arg = arg.slice(1, -1);

		const expected = commandArg.label === commandArg.type ?
			commandArg.label :
			`${commandArg.label} as ${commandArg.type}`;

		if(arg === null) {
			throw new Error(`Missing argument #${i + 1}; expected ${expected}`);
		} else if(i === command.args.length - 1) {
			arg += ctx.rawArgs.substring(regex.lastIndex);
		} else {
			try {
				args.push(await resolver[commandArg.type](ctx, commandArg, arg));
			} catch(err) {
				throw new Error(`Invalid argument #${i + 1} (expected ${expected})\n${err.message}`);
			}
		}
	}

	return args;
};
