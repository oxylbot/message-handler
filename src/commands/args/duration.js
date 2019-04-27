module.exports = async (ctx, arg, input) => {
	const years = input.match(/(\d+)\s*y((ea)?rs?)?/) || ["", 0];
	const months = input.match(/(\d+)\s*(M|mo(nths?)?)/) || ["", 0];
	const weeks = input.match(/(\d+)\s*w((ee)?ks?)?/) || ["", 0];
	const days = input.match(/(\d+)\s*d(ays?)?/) || ["", 0];
	const hours = input.match(/(\d+)\s*h((ou)?rs?)?/) || ["", 0];
	const minutes = input.match(/(\d+)\s*m(?!o)(in(ute)?s?)?/) || ["", 0];
	const seconds = input.match(/(\d+)\s*s(ec(ond)?s?)?/) || ["", 0];
	const ms = input.match(/(\d+)\s*m(illi)?s(ec(ond)?s?)?/) || ["", 0];

	return (parseInt(years[1]) * 31536000000) +
		(parseInt(months[1]) * 2592000000) +
		(parseInt(weeks[1]) * 604800000) +
		(parseInt(days[1]) * 86400000) +
		(parseInt(hours[1]) * 3600000) +
		(parseInt(minutes[1]) * 60000) +
		(parseInt(seconds[1]) * 1000) +
		parseInt(ms[1]);
};
