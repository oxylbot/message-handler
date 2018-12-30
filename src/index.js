const BucketClient = require("./sockets/BucketClient");
const CommandSocket = require("./sockets/CommandSocket");
const MessageSocket = require("./sockets/MessageSocket");
const path = require("path");
const protobuf = require("protobufjs");

const commands = require("./commands/index");
const sensors = require("./sensors/index");
const spam = require("./spam/index");

const bucketClient = new BucketClient(process.env.BUCKET_SOCKET_ADDRESS);
const commandSocket = new CommandSocket(process.env.COMMAND_SOCKET_ADDRESS);
const messageSocket = new MessageSocket(process.env.MESSAGE_SOCKET_ADDRESS);

async function init() {
	const commandProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "Command.proto"));
	const messageProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "Message.proto"));

	commandSocket.start(commandProto);
	messageSocket.start(messageProto);
	messageSocket.on("message", async message => {
		let next = await spam(message);
		if(next) next = await sensors(message);
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
