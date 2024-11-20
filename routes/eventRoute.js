const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorizeRole = require('../middlewares/authorizeRole');
const eventController = require('../controllers/eventController');
const { validateEvent, validateId, errors } = require('../middlewares/validateRequest')

const router = express.Router();

router.use(authenticate);

// Routes
router.post('/', authorizeRole(['organizer']), validateEvent, eventController.createEvent);
router.post('/:id/register', validateId, eventController.registerEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', validateId, eventController.getEventById);
router.put('/:id', authorizeRole(['organizer']), validateId, eventController.updateEvent);
router.delete('/:id', authorizeRole(['organizer']), validateId, eventController.deleteEvent);

// Celebrate error handler
router.use(errors());

module.exports = router;
