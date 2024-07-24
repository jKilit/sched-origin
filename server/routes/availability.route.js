const express = require('express');
const router = express.Router();
const { validateToken } = require('../validation/index');
const availabilityController = require('../controllers/availability.controller');

router.post('/', validateToken, availabilityController.setAvailability);
//router.put('/:userId', availabilityController.editAvailability);
router.get('/:userId', validateToken, availabilityController.getAvailability);
router.delete('/:userId', validateToken, availabilityController.deleteAvailability);

module.exports = router;
