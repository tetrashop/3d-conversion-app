const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('3D Conversion App Running!'));
app.get('/health', (req, res) => res.json({status: 'active'}));
app.listen(3000, () => console.log('Server: http://localhost:3000'));
