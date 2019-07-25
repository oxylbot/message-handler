const fs = require("fs").promises;
const path = require("path");

module.exports = {
	async run({ args: [command], commands }) {
		if(command) {
			command = commands.get(command) || [...commands.values()].find(cmd => cmd.aliases.includes(command));

			try {
				const file = await fs.readFile(path.resolve(__dirname, "..", "..", "..", "help", `${command.name}.md`), "utf8");

				return file
					.replace(/\r?\n\r?\n/g, "\n")
					.replace("{{command}}", command.aliases.concat(command.name).join(", "))
					.replace("{{usage}}", `${command.name} ${command.usage}`);
			} catch(err) {
				return "Markdown file for help command not found, please report this to the developers";
			}
		} else {
			const categories = {};
			let helpMsg = "";

			commands.forEach(({ type, name }) => categories[type] = (categories[type] || []).concat(name));
			Object.entries(categories).forEach(([category, commandList]) => {
				if(category === "creator") return;

				helpMsg += `__**${category.charAt(0).toUpperCase() + category.substring(1)}**`;
				helpMsg += `(${commandList.length} commands)__\n`;
				helpMsg += commandList.join(", ");
				helpMsg += "\n\n";
			});

			helpMsg += "Use `help <command>` to get more information on how to use a command";

			return helpMsg;
		}
	},
	args: [{
		type: "text",
		label: "command",
		lowercase: true,
		optional: true
	}]
};
