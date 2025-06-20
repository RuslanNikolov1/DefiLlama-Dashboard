import express from 'express';
import axios from 'axios';
import type { AxiosError } from 'axios';
import Comment from '../models/Comment';
import { protect } from '../middleware/auth';
import { Request } from 'express';
import { IUser } from '../models/User';

const router = express.Router();

router.get('/defi-news', async (req, res) => {
  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/v2/news/');
    // CryptoCompare returns { Data: [...] }
    const data = (response.data as { Data?: any[] });
    res.json({ results: data.Data || [] });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
      const axiosErr = error as AxiosError;
      console.error('CryptoCompare API error:', axiosErr.response?.data || axiosErr.message);
    } else if (error instanceof Error) {
      console.error('CryptoCompare API error:', error.message);
    } else {
      console.error('CryptoCompare API error:', error);
    }
    res.status(500).json({ message: 'Failed to fetch DeFi news', error: error instanceof Error ? error.message : String(error) });
  }
});

// Get all comments for a news item
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ newsId: req.params.id }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Add a comment to a news item (requires authentication)
router.post('/:id/comments', protect, async (req: Request & { user?: IUser }, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const comment = new Comment({
      newsId: req.params.id,
      userId: req.user.id,
      username: req.user.username,
      text: text.trim(),
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

export default router; 