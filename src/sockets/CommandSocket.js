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
		const command = this.proto.Command;

		const verifyError = command.verify(message);
		if(verifyError) throw new Error(verifyError);

		const buffer = command.encode(message).finish();

		this.socket.send(buffer);
	}

	close() {
		this.socket.close();
	}
}

module.exports = CommandSocket;
