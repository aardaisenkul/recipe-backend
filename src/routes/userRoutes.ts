import { Router } from 'express';
import { UserModel } from '../models/User';
import { UserController } from '../controllers/userController';
import { auth } from '../middleware/auth';
import pool from '../db';

/**
 * User Routes
 * Defines all routes related to user operations
 */
const router = Router();

// Initialize model and controller
const userModel = new UserModel(pool);
const userController = new UserController(userModel);

// Register new user
router.post('/register', userController.register.bind(userController));

// Login user
router.post('/login', userController.login.bind(userController));

// Get user profile (requires authentication)
router.get('/profile', auth, userController.getProfile.bind(userController));

// Update user profile (requires authentication)
router.patch('/profile', auth, userController.updateProfile.bind(userController));

export default router; 