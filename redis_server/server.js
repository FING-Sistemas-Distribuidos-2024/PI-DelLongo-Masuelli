const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {createClient} = require('redis');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());

app.use(cors());

const client = createClient({
	url: 'redis://localhost:6379'
	// url: 'redis://10.230.50.2:6379'
});

client.on('error', (err) => {
	console.error('Redis error:', err);
});

client.connect().catch(console.error);

app.post('/send', async (req, res) => {
	const message = req.body.message;
	try {
		await client.lPush('message', message);
		res.json({status: 'Message sent to Redis.'});
	} catch (err) {
		console.error('Error sending message to Redis:', err);
		res.status(500).json({status: 'Error sending message to Redis.'});
	}
});

app.get('/receive', async (req, res) => {
	try {
		const message = await client.rPop('message');
		res.json({message});
	} catch (err) {
		console.error('Error receiving message from Redis:', err);
		res.status(500).json({status: 'Error receiving message from Redis.'});
	}
});

app.listen(5000, () => {
	console.log('Server running at 5000.');
});