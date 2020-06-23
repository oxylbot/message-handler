const logger = require("./logger");
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
	logger.info("Loaded bucket RPC prototype");
	const discordProto = await protobuf.load(path.resolve(__dirname, "..", "bucket-proto", "service.proto"));
	logger.info("Loaded discord bucket prototype");
	bucketClient.start({
		discord: discordProto,
		rpc: rpcProto
	});
	logger.info("Started bucket socket");

	const messageProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "DiscordMessage.proto"));
	logger.info("Loaded message prototype");
	messageSocket.start(messageProto);
	logger.info("Started message socket");
	messageSocket.on("message", async message => {
		logger.debug("Received message from socket", { socketMessage: message });
		let next = await spam(message);
		if(next) next = await censors(message);
		if(next) next = await commands(message, bucketClient);
	});
}

init();

process.on("unhandledRejection", error => {
	logger.error(error.message, { error });
	process.exit(1);
});

process.on("SIGTERM", () => {
	bucketClient.close();
	messageSocket.close();
	logger.info("Sockets closed due to SIGTERM");

	process.exit(0);
});
