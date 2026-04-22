const express = require('express');
const cors = require('cors');
require('dotenv').config();

const groupRoutes = require('./modules/academic/routes/groups.routes');
const authRoutes = require("./modules/auth/routes");
const userRoutes = require('./modules/users/routes');
const marketplaceRoutes = require("./modules/marketplace/marketplace.routes");



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/groups', groupRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/products", marketplaceRoutes);

app.get('/', (req, res) => res.json({ message: 'StudentHub API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));