import { Response } from 'express';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

interface JWTPayload {
  id: number;
  email: string;
}

/**
 * UserController class
 * Handles all user-related operations like registration, login, and profile management
 */
export class UserController {
  private userModel: UserModel;
  private readonly jwtSecret: Secret;
  private readonly jwtExpiresIn: SignOptions['expiresIn'];

  constructor(userModel: UserModel) {
    this.userModel = userModel;
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'];
  }

  /**
   * Register a new user
   * 1. Check if user already exists
   * 2. Hash the password
   * 3. Create new user
   * 4. Generate JWT token
   */
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log('Registration attempt:', { email: req.body.email, username: req.body.username });
      
      // Validate request body
      if (!req.body.email || !req.body.password || !req.body.username) {
        console.error('Missing required fields:', req.body);
        res.status(400).json({ error: 'Email, password, and username are required' });
        return;
      }

      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(req.body.email);
      if (existingUser) {
        console.log('User already exists:', req.body.email);
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      // Create new user
      console.log('Creating new user...');
      const user = await this.userModel.create(
        req.body.username,
        req.body.email,
        req.body.password
      );
      console.log('User created successfully:', { id: user.id, email: user.email });

      // Generate JWT token
      const payload: JWTPayload = { id: user.id, email: user.email };
      const signOptions: SignOptions = { expiresIn: this.jwtExpiresIn };
      const token = jwt.sign(payload, this.jwtSecret, signOptions);

      // Send response without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Error registering user', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  /**
   * Login user
   * 1. Find user by email
   * 2. Verify password
   * 3. Generate JWT token
   */
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Find user by email
      const user = await this.userModel.findByEmail(req.body.email);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Verify password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Generate JWT token
      const payload: JWTPayload = { id: user.id, email: user.email };
      const signOptions: SignOptions = { expiresIn: this.jwtExpiresIn };
      const token = jwt.sign(payload, this.jwtSecret, signOptions);

      // Send response without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(400).json({ error: 'Error logging in' });
    }
  }

  /**
   * Get user profile
   * Returns user data without password
   */
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await this.userModel.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Send response without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching profile' });
    }
  }

  /**
   * Update user profile
   * Can update username, email, and password
   */
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      // If updating password, hash it first
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedUser = await this.userModel.update(req.user!.id, req.body);
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Send response without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: 'Error updating profile' });
    }
  }
} 