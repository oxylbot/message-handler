module.exports = async (ctx, arg, input) => {
	if(input.match(/<@&(\d{17,21})>/)) input = input.match(/<@&(\d{17,21})>/)[1];
	if(!("roles" in ctx.cache)) {
		ctx.logger.debug(`Getting guild roles for ${ctx.guildId}`);
		const resp = await ctx.bucket.request("getGuildRoles", {
			guildId: ctx.guildId
		});

		ctx.cache.roles = resp.roles;
	}

	const role = ctx.cache.roles.find(({ id, name }) => id === input || name === input);
	ctx.logger.verbose("Resolved role", {
		role,
		input,
		roles: ctx.cache.roles
	});

	if(role) return role;
	else throw new Error("Role not found");
};
