const zmq = require("zeromq");

class CommandSocket {
	constructor() {
		this.socket = zmq.socket("push");

		this.proto = null;
	}

	start(proto) {
		this.proto = proto;
		this.socket.connect(`tcp://commands-zmq-proxy:${process.env.COMMANDS_ZMQ_PROXY_SERVICE_PORT_PULL}`);
	}

	send(message) {
		const commandProto = this.proto.lookup("Command");

		const verifyError = commandProto.verify(message);
		if(verifyError) throw new Error(verifyError);

		this.socket.send(commandProto.encode(message).finish());
	}

	close() {
		this.socket.close();
	}
}

module.exports = CommandSocket;
