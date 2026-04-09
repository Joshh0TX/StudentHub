// courses.controller.js
const service = require("./courses.service");

exports.createCourse = async (req, res) => {
    try {
        const result = await service.createCourse(req.user.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.joinCourse = async (req, res) => {
    try {
        const result = await service.joinCourse(req.user.id, req.body.code);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};