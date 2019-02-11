const EventEmitter = require("events");
const zmq = require("zeromq");

class MessageSocket extends EventEmitter {
	constructor() {
		super();
		this.socket = zmq.socket("pull");
		this.socket.on("message", this.message.bind(this));

		this.proto = null;
	}

	start(proto) {
		this.proto = proto;
		this.socket.connect(`tcp://sharder-messages-zmq-proxy:${process.env.SHARDER_MESSAGES_ZMQ_PROXY_SERVICE_PORT_PUSH}`);
	}

	message(message) {
		this.emit("message", this.proto.lookup("Message").decode(message));
	}

	close() {
		this.socket.close();
	}
}

module.exports = MessageSocket;
