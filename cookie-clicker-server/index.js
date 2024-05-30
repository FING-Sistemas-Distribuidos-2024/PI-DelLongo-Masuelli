const express = require('express');
const redis = require('redis');
const app = express();
const port = 3000;

const client = redis.createClient({
  host: 'redis', // Nombre del servicio Redis en Kubernetes
  port: 6379
});

client.on('error', (err) => {
  console.error('Redis error: ', err);
});

app.use(express.json());

app.get('/count', (req, res) => {
  client.get('count', (err, count) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: count ? parseInt(count) : 0 });
  });
});

app.post('/click', (req, res) => {
  client.incr('count', (err, count) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: count });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
