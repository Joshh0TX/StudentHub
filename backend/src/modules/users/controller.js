// users.controller.js
const userService = require('./service');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming auth middleware sets req.user
        const profile = await userService.getProfile(userId);
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};