const express = require('express');
const cors = require('cors');
require('dotenv').config();

const groupRoutes = require('./modules/academic/routes/groups.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/groups', groupRoutes);

app.get('/', (req, res) => res.json({ message: 'StudentHub API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));