const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Your Express app
const User = require('../models/user');

// Mock User model methods
jest.mock('../models/user', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userInput = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'attendee',
      };

      User.findOne.mockResolvedValue(null); // Mock no existing user
      User.create.mockResolvedValue({
        _id: 'mockUserId',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'attendee',
      });

      // Act
      const response = await request(app).post('/api/auth/register').send(userInput);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toMatchObject({
        id: 'mockUserId',
        email: 'john.doe@example.com',
        role: 'attendee',
      });
    });

    it('should return an error if the user already exists', async () => {
      // Arrange
      User.findOne.mockResolvedValue({
        _id: 'mockUserId',
        email: 'john.doe@example.com',
      }); // Mock existing user

      const userInput = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'attendee',
      };

      // Act
      const response = await request(app).post('/api/auth/register').send(userInput);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /login', () => {
    it('should log in a user successfully and return a token', async () => {
      // Arrange
      const userInput = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockHashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({
        _id: 'mockUserId',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: mockHashedPassword,
        role: 'attendee',
      });

      const mockToken = 'mockJwtToken';
      jest.spyOn(jwt, 'sign').mockReturnValue(mockToken); // Mock JWT sign

      // Act
      const response = await request(app).post('/api/auth/login').send(userInput);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toMatchObject({ token: mockToken });
    });

    it('should return an error for invalid email', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null); // Mock no user found

      const userInput = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      // Act
      const response = await request(app).post('/api/auth/login').send(userInput);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return an error for invalid password', async () => {
      // Arrange
      const mockHashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({
        _id: 'mockUserId',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: mockHashedPassword,
        role: 'attendee',
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Mock password mismatch

      const userInput = {
        email: 'john.doe@example.com',
        password: 'wrongPassword',
      };

      // Act
      const response = await request(app).post('/api/auth/login').send(userInput);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
