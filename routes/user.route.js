const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateRegistration, validateLogin, validateToken } = require('../validation/index');

router.get('/', validateToken, userController.allUsers);
router.post('/register', validateRegistration, userController.register);
router.post('/login', validateLogin, userController.login);
router.delete('/delete/:id', validateToken, userController.deleteUser);

module.exports = router;
