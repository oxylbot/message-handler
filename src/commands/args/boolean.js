module.exports = async (ctx, arg, input) => {
	if(["enable", "yes", "true", "1"].includes(input)) return true;
	else if(["disable", "no", "false", "0"].includes(input)) return false;
	else throw new Error("Expected a boolean input (true/false or yes/no)");
};
