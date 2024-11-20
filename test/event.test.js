const request = require('supertest');
const app = require('../app'); // Your Express app
const User = require('../models/user');
const Event = require('../models/event');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock dependencies
jest.mock('../models/user', () => ({
    findById: jest.fn()
}))
jest.mock('../models/event');
jest.mock('jsonwebtoken');


// Sample data
const mockUser = {
    id: 'mockUserId',
    name: 'Test User',
    email: 'test.user@example.com',
    role: 'organizer',
};

const mockEvent = {
    // _id: 'mockEventId',
    title: 'Test Event',
    description: 'This is a test event',
    date: new Date(),
    time: "3:30",
    organizer: 'mockUserId'
};

describe('Event Routes', () => {
    // Middleware mock
    beforeEach(() => {
        jwt.verify.mockImplementation(() => mockUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/events', () => {
        it('should create a new event', async () => {
            jest.spyOn(jwt, 'verify').mockReturnValue(mockUser); // Mock JWT sign
            Event.create.mockResolvedValue(mockEvent);
            User.findById.mockResolvedValue(mockUser)

            const response = await request(app)
            .post('/api/event')
            .set('Authorization', 'Bearer mockToken')
            .send({
                title: 'Test Event',
                description: 'This is a test event',
                date: mockEvent.date,
                time: "3:30"
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Event created successfully');
            expect(Event.create).toHaveBeenCalledWith({
                ...mockEvent,
                organizer: mockUser.id,
            });
        });
    });

    describe('POST /api/events/:id/register', () => {
        it('should register a user for an event', async () => {

            const userId = new mongoose.Types.ObjectId();
            mockEvent._id = 'mockEventId'
            mockEvent.participants = []
            Event.findById.mockResolvedValue(mockEvent);

            User.findById.mockResolvedValue({...mockUser, id: userId })

            const response = await request(app)
                .post(`/api/event/${mockEvent._id}/register`)
                .set('Authorization', 'Bearer mockToken')
                .send()

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Successfully registered for the event');
            expect(Event.findById).toHaveBeenCalledWith(mockEvent._id);
        });

        it('should return an error if the event does not exist', async () => {
            Event.findById.mockResolvedValue(null);

            const response = await request(app)
                .post(`/api/event/invalidEventId/register`)
                .set('Authorization', 'Bearer mockToken');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Event not found');
        });
    });

    describe('GET /api/events', () => {
        it('should retrieve all events', async () => {
            Event.find.mockResolvedValue([mockEvent]);

            const mockPopulate = jest.fn().mockReturnThis();
            const mockExec = jest.fn().mockResolvedValue([
                {
                    ...mockEvent,
                    _id: 'mockEventId',
                    organizer: { name: 'John Doe', email: 'john@example.com' },
                    participants: [{ name: 'Jane Doe', email: 'jane@example.com' }],
                },
            ]);

            // Mock the find function
            jest.spyOn(Event, 'find').mockImplementation(() => ({
                populate: mockPopulate,
                exec: mockExec,
            }));

            const response = await request(app)
                .get('/api/event')
                .set('Authorization', 'Bearer mockToken')
                .send()

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Events retrieved successfully');
        });
    });

    describe('GET /api/events/:id', () => {
        it('should retrieve an event by ID', async () => {
            Event.findById.mockResolvedValue(mockEvent);

            const mockPopulate = jest.fn().mockReturnThis();
            const mockExec = jest.fn().mockResolvedValue(
                {
                    ...mockEvent,
                    _id: 'mockEventId',
                    organizer: { name: 'John Doe', email: 'john@example.com' },
                    participants: [{ name: 'Jane Doe', email: 'jane@example.com' }],
                },
            );

            // Mock the find function
            jest.spyOn(Event, 'findById').mockImplementation(() => ({
                populate: mockPopulate,
                exec: mockExec,
            }));

            const response = await request(app)
                .get(`/api/event/mockEventId`)
                .set('Authorization', 'Bearer mockToken')
                .send()

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Event details retrieved successfully');
        });

    });

    describe('PUT /api/events/:id', () => {
        it('should update an event', async () => {
            jest.spyOn(jwt, 'verify').mockReturnValue(mockUser); // Mock JWT sign
            User.findById.mockResolvedValue(mockUser)
            mockEvent._id = 'mockEventId'
            Event.findById.mockResolvedValue(mockEvent);
            Event.updateOne.mockResolvedValue({ ...mockEvent, title: 'Updated Event' })

            const response = await request(app)
            .put(`/api/event/${mockEvent._id}`)
            .set('Authorization', 'Bearer mockToken')
            .send({ title: 'Updated Event' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Event updated successfully');
            expect(Event.findById).toHaveBeenCalledWith(mockEvent._id);
            expect(response.body.data).toMatchObject({ title: 'Updated Event' });
        });

        it('should return an error if the user is not the organizer', async () => {
            Event.findById.mockResolvedValue({ ...mockEvent, organizer: 'differentUserId' });

            const response = await request(app)
                .put(`/api/event/${mockEvent._id}`)
                .set('Authorization', 'Bearer mockToken')
                .send({ title: 'Updated Event' });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('You are not authorized to update this event');
        });
    });

    describe('DELETE /api/events/:id', () => {
        it('should delete an event', async () => {
            Event.findById.mockResolvedValue(mockEvent);
            Event.prototype.remove = jest.fn().mockResolvedValue(mockEvent);

            const response = await request(app)
                .delete(`/api/event/${mockEvent._id}`)
                .set('Authorization', 'Bearer mockToken');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Event deleted successfully');
        });

        it('should return an error if the event is not found', async () => {
            Event.findById.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/event/invalidEventId')
                .set('Authorization', 'Bearer mockToken');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Event not found');
        });
    });
});
