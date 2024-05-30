const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
app.use(bodyParser.json());

// Configurar el cliente de Redis
const client = redis.createClient({
  host: 'redis',
  port: 6379
});

client.on('error', (err) => {
  console.error('Error de Redis:', err);
});

app.post('/send', (req, res) => {
  const message = req.body.message;
  client.set('message', message, (err) => {
    if (err) {
      return res.status(500).json({ status: 'Error al enviar el mensaje a Redis' });
    }
    res.json({ status: 'Mensaje enviado a Redis' });
  });
});

app.get('/receive', (req, res) => {
  client.get('message', (err, message) => {
    if (err) {
      return res.status(500).json({ status: 'Error al recibir el mensaje de Redis' });
    }
    res.json({ message });
  });
});

app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});
