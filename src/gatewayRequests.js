const superagent = require("superagent");

const gatewayBaseURL = `http://gateway:${process.env.GATEWAY_SERVICE_PORT}`;

class Term {
	constructor(request, methods = []) {
		this.request = request;

		methods.forEach(method => {
			if(typeof method === "object") {
				this[method.use] = ((...args) => {
					request.complete = false;
					return request[method.real](...args);
				}).bind(request);
			} else {
				this[method] = ((...args) => {
					request.complete = false;
					return request[method](...args);
				}).bind(request);
			}
		});
	}

	then(...args) {
		this.request.then(...args);
	}
}

class Request {
	constructor() {
		this.url = `${gatewayBaseURL}`;
		this.request = superagent;
		this.method = "get";
		this.body = {};
		this.query = {};
		this.headers = {};

		this.complete = false;
		return new Term(this, ["discord"]);
	}

	query(key, value) {
		if(typeof key === "object") Object.assign(this.query, key);
		else this.query[key] = value;

		this.complete = true;
		return new Term(this, ["query"]);
	}

	delete() {
		this.method = "delete";
		this.complete = true;

		return new Term(this);
	}

	discord() {
		this.addPath("discord");

		return new Term(this, ["users", "guilds"]);
	}

	guilds() {
		this.addPath("guilds");
		this.complete = false;

		return new Term(this, [{
			use: "get",
			real: "getGuildByID"
		}]);
	}

	getGuildByID(id) {
		if(!id) throw new Error("ID must be defined for discord().guilds().get(id)");

		this.addPath(id);
		this.complete = true;

		return new Term(this, ["delete", {
			use: "channels",
			real: "getGuildChannels"
		}, {
			use: "members",
			real: "getGuildMembers"
		}, {
			use: "roles",
			real: "getGuildRoles"
		}, {
			use: "voicestates",
			real: "getGuildVoiceStates"
		}]);
	}

	getGuildChannels() {
		this.addPath("channels");
		this.complete = true;

		return new Term(this, ["query", {
			use: "get",
			real: "getChannelByID"
		}]);
	}

	getChannelByID(id) {
		if(!id) throw new Error("ID must be defined for discord().guilds().get(id).channels().get(id)");

		this.addPath(id);
		this.complete = true;

		return new Term(this, [{
			use: "members",
			real: "getChannelMembers"
		}, "delete"]);
	}

	getChannelMembers() {
		this.addPath("members");
		this.complete = true;

		return new Term(this);
	}

	getGuildMembers() {
		this.addPath("members");

		return new Term(this, [{
			use: "get",
			real: "getMemberByID"
		}, "query"]);
	}

	getMemberByID(id) {
		if(!id) throw new Error("ID must be defined for discord().guilds().get(id).members().get(id)");

		this.addPath(id);
		this.complete = true;

		return new Term(this, ["delete"]);
	}

	getGuildRoles() {
		this.addPath("roles");
		this.complete = true;

		return new Term(this, [{
			use: "get",
			real: "getRoleByID"
		}, "query"]);
	}

	getRoleByID(id) {
		if(!id) throw new Error("ID must be defined for discord().guilds().get(id).roles().get(id)");

		this.addPath(id);
		this.complete = true;

		return new Term(this, ["delete"]);
	}

	getGuildVoiceStates() {
		this.addPath("voicestates");

		return new Term(this, [{
			use: "get",
			real: "getVoiceStateByUserID"
		}]);
	}

	getVoiceStateByUserID(id) {
		if(!id) throw new Error("ID must be defined for discord().guilds().get(id).voicestates().get(id)");

		this.addPath(id);
		this.complete = true;

		return new Term(this, ["delete"]);
	}

	users() {
		this.addPath("users");
		this.complete = true;

		return new Term(this, [{
			use: "get",
			real: "getUserByID"
		}, "query"]);
	}

	getUserByID(id) {
		if(!id) throw new Error("ID must be defined for discord().users().get(id)");

		this.addPath(id);
		this.complete = true;

		return new Term(this);
	}

	addPath(...paths) {
		this.url += `/${paths.join("/")}`;
	}

	setMethod(method) {
		this.method = method;
	}

	then(success, failure) {
		if(!this.complete) throw new Error("Cannot execute request if it is not valid");

		return this.request[this.method](this.url)
			.set(this.headers)
			.query(this.query)
			.send(this.body)
			.then(res => res.body)
			.then(success, failure);
	}
}

module.exports = () => new Request();
