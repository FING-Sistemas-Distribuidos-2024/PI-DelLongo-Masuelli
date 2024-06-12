/**
 * Importing necessary modules
 * 'redis' is used for interacting with a Redis database
 * 'ws' is used for creating a WebSocket server
 */
const redis = require("redis");
const WebSocketServer = require('ws');

/**
 * Creating a Redis client and connecting to a Redis server
 * The URL of the Redis server is specified in the 'url' property
 */
let client = redis.createClient({
	// url: 'redis://localhost:6379'
	url: 'redis://redis-clusterip:6379'
});
let port = 8080;

/**
 * Handling Redis client errors
 */
client.on('error', err => console.log('Redis client error.', err));

/**
 * Connecting the Redis client
 */
client.connect();

/**
 * Creating a WebSocket server that listens on a specified port
 */
const wss = new WebSocketServer.Server({port: port})
// const wss = new WebSocketServer.Server({ port: 8080 })

/**
 * Function to retrieve the ten latest messages from the Redis database
 * It uses the 'lRange' method to get the keys of the latest messages
 * Then retrieves each message using the 'get' method
 */
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

/**
 * Handling new client connections to the WebSocket server
 * When a new client connects, the server retrieves the latest messages and sends them to the client
 */
wss.on("connection", async ws => {
	console.log("New client connected.");

	let messages = await retrieveLatestMessages(ws);
	const sendHistory = async () => {
		await ws.send(JSON.stringify(messages));
	}
	await sendHistory();

	/**
	 * Handling incoming messages from a client
	 * When the server receives a message from a client, it stores the message in the Redis database with a timestamp as the key
	 * It also updates the list of keys to keep only the ten latest keys
	 * Then, the server sends the received message to all connected clients
	 */
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

	/**
	 * Handling client disconnection
	 */
	ws.on("close", () => {
		console.log("WS: The client has disconnected.");
	});

	/**
	 * Handling errors
	 */
	ws.onerror = function () {
		console.log("WS: Some error occurred.")
	}
});

console.log(`The WebSocket server is running at ${port}`);