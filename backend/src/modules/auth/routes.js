const express = require("express");
const router = express.Router();
const authMiddleware = require("./authMiddleware");

const controller = require("./controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authMiddleware, controller.getMe);

module.exports = router;