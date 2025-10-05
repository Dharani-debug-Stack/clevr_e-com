import express from 'express';
import Favorite from '../models/Favorite.js';

const router = express.Router();

// ------------------------ GET favorites for a user ------------------------
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId }).populate('productId');
    res.json(favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------ POST add to favorites ------------------------
router.post('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if favorite already exists
    const existing = await Favorite.findOne({ userId, productId });
    if (existing) return res.json(existing);

    const favorite = new Favorite({ userId, productId });
    await favorite.save();
    res.json(favorite);
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------ DELETE favorite ------------------------
router.delete('/:id', async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error("Error deleting favorite:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;


