const EventEmitter = require("events");
const { Pull } = require("zeromq");

class MessageSocket extends EventEmitter {
	constructor() {
		super();
		this.socket = new Pull();
		this.messageHandler();

		this.proto = null;
	}

	start(proto) {
		this.proto = proto;
		this.socket.connect(`tcp://sharder-messages-zmq-proxy:${process.env.SHARDER_MESSAGES_ZMQ_PROXY_SERVICE_PORT_PUSH}`);
	}

	async messageHandler() {
		while(!this.socket.closed) {
			const [message] = await this.socket.receive();
			this.emit("message", this.proto.lookup("Message").decode(message));
		}
	}

	close() {
		this.socket.close();
	}
}

module.exports = MessageSocket;
