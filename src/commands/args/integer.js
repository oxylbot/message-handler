module.exports = async (ctx, arg, input) => {
	if(isNaN(input)) throw new Error(`${input} is not an integer`);
	else input = parseInt(input);

	if(arg.minimum && input < arg.minimum) {
		throw new Error(`${input} is below the minimum of ${arg.minimum}`);
	} else if(arg.maximum && input > arg.maximum) {
		throw new Error(`${input} is above the maximum of ${arg.minimum}`);
	} else {
		return input;
	}
};
