const express = require('express');
const cors = require('cors');
require('dotenv').config();

const groupRoutes = require('./modules/academic/routes/groups.routes');
const resourceRoutes = require('./modules/academic/routes/resources.routes');
const userRoutes = require('./modules/users/routes');
const loginRoutes = require('./modules/auth/routes');
const signupRoutes = require('./modules/auth/routes');
const marketplaceRoutes = require("./modules/marketplace/marketplace.routes");


const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use('/api/groups', groupRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', signupRoutes);
app.use('/api/auth', loginRoutes);

app.use("/api/products", marketplaceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));