const Event = require('../models/event');
const createError = require('http-errors');

const createEvent = async (eventData) => {
    return await Event.create(eventData);
};

const registerForEvent = async (userId, eventId) => {
    const event = await Event.findById(eventId);
    if (!event) {
        throw createError(404, 'Event not found');
    }

    if (event.organizer.toString() === userId) {
        throw createError(400, "Organizers cannot register as participants in their own events");
    }

    if (event.participants.includes(userId)) {
        throw createError(400, 'User already registered for this event');
    }

    event.participants.push(userId);
    await Event.updateOne(
        {id: event.id},
        {
            $set: {
                participants : event.participants
            }
        },
        { runValidators: true }
    )

    return event;
};

const getAllEvents = async () => {
    return await Event.find().populate('organizer', 'name email').populate('participants', 'name email');
};

const getEventById = async (id) => {
    const event = await Event.findById(id).populate('organizer', 'name email').populate('participants', 'name email');
    if (!event) {
        throw createError(404, 'Event not found');
    }
    return event;
};

const updateEvent = async (id, updateData, userId) => {
    const event = await Event.findById(id);
    if (!event) {
        throw createError(404, 'Event not found');
    }
    if (event.organizer.toString() !== userId) {
        throw createError(403, 'You are not authorized to update this event');
    }

    return await Event.updateOne({_id: id}, {$set: {...updateData}})
};

const deleteEvent = async (id, userId) => {
    const event = await Event.findById(id);
    if (!event) {
        throw createError(404, 'Event not found');
    }
    if (event.organizer.toString() !== userId) {
        throw createError(403, 'You are not authorized to delete this event');
    }
    await Event.remove({id:id});
    return event;
};

module.exports = {
    createEvent,
    registerForEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
