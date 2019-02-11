const path = require("path");
const protobuf = require("protobufjs");

const commands = require("./commands/index");
const censors = require("./censors/index");
const spam = require("./spam/index");

const BucketClient = require("./sockets/BucketClient");
const CommandSocket = require("./sockets/CommandSocket");
const MessageSocket = require("./sockets/MessageSocket");

const bucketClient = new BucketClient();
const commandSocket = new CommandSocket();
const messageSocket = new MessageSocket();

async function init() {
	const rpcProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "rpcWrapper.proto"));
	const discordProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "discordapi", "service.proto"));
	bucketClient.start({
		discord: discordProto,
		rpc: rpcProto
	});

	const commandProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "Command.proto"));
	commandSocket.start(commandProto);

	const messageProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "DiscordMessage.proto"));
	messageSocket.start(messageProto);
	messageSocket.on("message", async message => {
		let next = await spam(message);
		if(next) next = await censors(message);
		if(next) next = await commands(message, commandSocket);
	});
}

init();

process.on("SIGTERM", () => {
	bucketClient.close();
	commandSocket.close();
	messageSocket.close();

	process.exit(0);
});
