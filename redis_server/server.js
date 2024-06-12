const redis = require("redis");
const WebSocketServer = require('ws');

let client = redis.createClient({
	url: 'redis://localhost:6379'
	// url: 'redis://redis-clusterip:6379'
});
let port = 5000;

client.on('error', err => console.log('Redis client error.', err));
client.connect();
const wss = new WebSocketServer.Server({port: port})
// const wss = new WebSocketServer.Server({ port: 8080 })

// retrieve ten latest messages
const retrieveLatestMessages = async () => {
	let keys = await client.lRange("keys", 0, 9);
	let messages = [];
	for (let key of keys) {
		try {
			messages.unshift(await client.get(key));
		} catch (err) {
			console.log(`Error retrieving message from Redis. Key: ${key}.`, err);
		}
	}
	console.log("Messages retrieved from Redis: ", messages);
	return messages;
}

wss.on("connection", async ws => {
	console.log("New client connected.");

	let messages = await retrieveLatestMessages(ws);
	const sendHistory = async () => {
		await ws.send(JSON.stringify(messages));
	}
	await sendHistory();

	//on message from client
	ws.on("message", async data => {
		console.log(`Client has sent: ${data}`)

		// Set timestamp as a key and user: message as value
		let key = Date.now().toString();
		await client.set(key, data);
		await client.lPush("keys", key);
		await client.lTrim("keys", 0, 9); // keep only the 10 latest keys
		wss.clients.forEach((client) => {
			client.send(`${data}`);
		});
	});

	// handle client disconnect
	ws.on("close", () => {
		console.log("WS: The client has disconnected.");
	});

	// handle errors
	ws.onerror = function () {
		console.log("WS: Some error occurred.")
	}
});

console.log(`The WebSocket server is running at ${port}`);