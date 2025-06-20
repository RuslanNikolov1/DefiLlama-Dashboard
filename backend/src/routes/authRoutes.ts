import express from 'express';
import { body } from 'express-validator';
import {
  signUp,
  signIn,
  verifyToken,
  signOut
} from '../controllers/authController';
import type { AuthRequest } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const signUpValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const signInValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/signup', signUpValidation, signUp);
router.post('/signin', signInValidation, signIn);
router.get('/verify', protect, (req, res) => verifyToken(req as AuthRequest, res));
router.post('/signout', protect, signOut);

export default router; 