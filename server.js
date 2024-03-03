const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/ping', (req, res) => {
    res.send('Pong!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Express server is running at http://localhost:${port}/ping`);
});
