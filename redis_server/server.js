const express = require('express');  // permite hacer endpoint de http-rest 
const bodyParser = require('body-parser');
const cors = require('cors');  // cross origin resources 
const {createClient} = require('redis');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS

// cliente de Redis
const client = createClient({
	// ip del servidor de redis
	url: 'redis://10.230.50.2:6379'
	//url: 'redis://localhost:6379'
});

client.on('error', (err) => {
	console.error('Redis error:', err);
});

// conectar el cliente de Redis
client.connect().catch(console.error);

// ruta para enviar mensajes
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

// ruta para recibir mensajes
app.get('/receive', async (req, res) => {
	try {
		const message = await client.rPop('message');
		res.json({message});
	} catch (err) {
		console.error('Error receiving message from Redis:', err);
		res.status(500).json({status: 'Error receiving message from Redis.'});
	}
});

// iniciar el servidor en el puerto 5000
app.listen(5000, () => {
	console.log('Server running at 5000.');
});
