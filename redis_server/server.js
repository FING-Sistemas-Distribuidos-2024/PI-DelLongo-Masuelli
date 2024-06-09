const redis = require("redis");

// Initilize redis client
let client = redis.createClient({
	url: 'redis://redis-clusterip:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

// Initialize websocket server
const WebSocketServer = require('ws');
// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 })
// Creating connection using websocket
wss.on("connection", async ws => {
	console.log("new client connected");
	// When a client is connected, send all messages
	let messages = []
	await client.keys('*', (err, keys) => {
		console.log("Retrieve all keys", keys);
		keys.forEach((key) => {
			client.get(key, function (err, message) {
				messages.push(message)
				console.log("key", key);
			});
		})
	});

	console.log("messages", messages);

	//on message from client
	ws.on("message", async data => {
		console.log(`Client has sent us: ${data}`)

		// Set timestamp as a key and user: message as value
		await client.set(Date.now().toString(), data)
		wss.clients.forEach((client) => {
			client.send(`${data}`);
		});
	});
	// handling what to do when clients disconnects from server
	ws.on("close", () => {
		console.log("the client has disconnected");
	});
	// handling client connection error
	ws.onerror = function () {
		console.log("Some Error occurred")
	}
});
console.log("The WebSocket server is running on port 8080");