const EventEmitter = require("events");
const zmq = require("zeromq");

class MessageSocket extends EventEmitter {
	constructor(address) {
		super();
		this.socket = zmq.socket("pull");
		this.socket.on("message", this.message.bind(this));
		this.address = address;

		this.proto = null;
	}

	start(proto) {
		this.proto = proto;
		this.socket.connect(this.address);
	}

	message(message) {
		const discordMessage = this.proto.DiscordMessage;

		this.emit("message", discordMessage.toObject(discordMessage.decode(message)));
	}

	close() {
		this.socket.close();
	}
}

module.exports = MessageSocket;
