const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'POST works!' });
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
  // Keep it alive
  setInterval(() => {}, 1000);
});
