const userService = require('./service');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updated = await userService.updateProfile(userId, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file.path;
    const updated = await userService.updateProfile(userId, { profileImage: imageUrl });
    res.json({ profileImage: updated.profileImage });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.uploadCoverImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file.path;
    const updated = await userService.updateProfile(userId, { coverImage: imageUrl });
    res.json({ coverImage: updated.coverImage });
  } catch (error) {
    console.error('Error uploading cover image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};