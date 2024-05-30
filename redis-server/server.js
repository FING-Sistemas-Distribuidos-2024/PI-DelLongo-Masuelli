const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('redis');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS

// Configurar el cliente de Redis
const client = createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.error('Error de Redis:', err);
});

// Conectar el cliente de Redis
client.connect().catch(console.error);

// Ruta para enviar mensajes
app.post('/send', async (req, res) => {
  const message = req.body.message;
  try {
    await client.set('message', message);
    res.json({ status: 'Mensaje enviado a Redis' });
  } catch (err) {
    console.error('Error al enviar el mensaje a Redis:', err);
    res.status(500).json({ status: 'Error al enviar el mensaje a Redis' });
  }
});

// Ruta para recibir mensajes
app.get('/receive', async (req, res) => {
  try {
    const message = await client.get('message');
    res.json({ message });
  } catch (err) {
    console.error('Error al recibir el mensaje de Redis:', err);
    res.status(500).json({ status: 'Error al recibir el mensaje de Redis' });
  }
});

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});
