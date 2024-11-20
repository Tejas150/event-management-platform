const eventService = require('../services/eventService');
const { sendSuccess } = require('../utils/apiResponse');

const createEvent = async (req, res, next) => {
    try {
        const eventData = {
            ...req.body,
            organizer: req.user.id,
        };
        const event = await eventService.createEvent(eventData);
        sendSuccess(res, 'Event created successfully', event);
    } catch (error) {
        next(error);
    }
};

const registerEvent = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;

        const event = await eventService.registerForEvent(userId, eventId);

        // Send success response
        sendSuccess(res, 'Successfully registered for the event', event);
    } catch (error) {
        next(error);
    }
};

const getAllEvents = async (req, res, next) => {
    try {
        const events = await eventService.getAllEvents();
        sendSuccess(res, 'Events retrieved successfully', events);
    } catch (error) {
        next(error);
    }
};

const getEventById = async (req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        sendSuccess(res, 'Event details retrieved successfully', event);
    } catch (error) {
        next(error);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
        sendSuccess(res, 'Event updated successfully', event);
    } catch (error) {
        next(error);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const event = await eventService.deleteEvent(req.params.id, req.user.id);
        sendSuccess(res, 'Event deleted successfully', event);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEvent,
    registerEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
