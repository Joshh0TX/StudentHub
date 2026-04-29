const express = require('express');
const cors = require('cors');
require('dotenv').config();

const groupRoutes = require('./modules/academic/routes/groups.routes');
const resourceRoutes = require('./modules/academic/routes/resources.routes');
const userRoutes = require('./modules/users/routes');
const marketplaceRoutes = require("./modules/marketplace/marketplace.routes");
const timetableRoutes = require("./modules/academic/routes/timetable.routes");

const path = require("path");

const app = express();
app.use(cors({
    origin: [
        "https://student-hub-henna-nu.vercel.app",
        "https://stuudo.onrender.com",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use('/api/groups', groupRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', require('./modules/auth/routes'));
app.use("/api/timetables", timetableRoutes);
app.use("/api/products", marketplaceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));