const fs = require("fs").promises;
const path = require("path");
const helpFilesPath = path.resolve(__dirname, "..", "..", "..", "help-md-files");

module.exports = {
	async run({ args: [command], commands }) {
		if(command) {
			command = commands.get(command) || [...commands.values()].find(cmd => cmd.aliases.includes(command));

			try {
				const file = await fs.readFile(path.resolve(helpFilesPath, command.type, `${command.name}.md`), "utf8");

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

			for(const [key, { type, name }] of commands) {
				if(key !== name) continue;
				if(!Object.prototype.hasOwnProperty.call(categories, type)) {
					categories[type] = [name];
				} else {
					categories[type].push(name);
				}
			}

			Object.entries(categories).forEach(([category, commandList]) => {
				if(category === "creator") return;

				helpMsg += `__**${category.charAt(0).toUpperCase() + category.substring(1)}** `;
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
