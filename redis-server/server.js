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
    await client.lPush('messages', message); // Encolar el mensaje
    res.json({ status: 'Mensaje encolado en Redis' });
  } catch (err) {
    console.error('Error al encolar el mensaje en Redis:', err);
    res.status(500).json({ status: 'Error al encolar el mensaje en Redis' });
  }
});

// Ruta para recibir mensajes
app.get('/receive', async (req, res) => {
  try {
    const message = await client.rPop('messages'); // Desencolar el mensaje
    res.json({ message });
  } catch (err) {
    console.error('Error al desencolar el mensaje de Redis:', err);
    res.status(500).json({ status: 'Error al desencolar el mensaje de Redis' });
  }
});

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});
