const express = require('express');
const cors = require('cors');
require('dotenv').config();

const groupRoutes = require('./modules/academic/routes/groups.routes');
const resourceRoutes = require('./modules/academic/routes/resources.routes');
const userRoutes = require('./modules/users/routes');
const loginRoutes = require('./modules/auth/routes');
const signupRoutes = require('./modules/auth/routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/groups', groupRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', signupRoutes);
app.use('/api/auth', loginRoutes);


app.get('/', (req, res) => res.json({ message: 'StudentHub API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));