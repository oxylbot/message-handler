const path = require("path");
const protobuf = require("protobufjs");

const commands = require("./commands/index");
const censors = require("./censors/index");
const spam = require("./spam/index");

const BucketClient = require("./sockets/BucketClient");
const MessageSocket = require("./sockets/MessageSocket");

const bucketClient = new BucketClient();
const messageSocket = new MessageSocket();

async function init() {
	const rpcProto = await protobuf.load(path.resolve(__dirname, "..", "bucket-proto", "rpcWrapper.proto"));
	const discordProto = await protobuf.load(path.resolve(__dirname, "..", "bucket-proto", "service.proto"));
	bucketClient.start({
		discord: discordProto,
		rpc: rpcProto
	});

	const messageProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "DiscordMessage.proto"));
	messageSocket.start(messageProto);
	messageSocket.on("message", async message => {
		let next = await spam(message);
		if(next) next = await censors(message);
		if(next) next = await commands(message, bucketClient);
	});
}

init();

process.on("unhandledRejection", err => {
	console.error(err.stack);
	process.exit(1);
});

process.on("SIGTERM", () => {
	bucketClient.close();
	messageSocket.close();

	process.exit(0);
});
