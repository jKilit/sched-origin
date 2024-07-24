const express = require('express');
const { validateToken } = require('../validation/index');
const router = express.Router();
const shiftController = require('../controllers/shift.controller');

router.get('/' , validateToken, shiftController.getShifts);
router.post('/', validateToken, shiftController.createShift);
router.put('/:id', validateToken,  shiftController.updateShift);
router.delete('/:id', validateToken, shiftController.deleteShift);

module.exports = router;
