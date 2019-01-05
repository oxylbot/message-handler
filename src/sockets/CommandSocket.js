const zmq = require("zeromq");

class CommandSocket {
	constructor(address) {
		this.socket = zmq.socket("push");
		this.address = address;

		this.proto = null;
	}

	start(proto) {
		this.proto = proto;
		this.socket.connect(this.address);
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
