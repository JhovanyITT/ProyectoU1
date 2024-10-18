const express = require('express');
const taskController = require('../controllers/task.firebase.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// Métodos express, envia los parametros req y res a cada parte programada.
router.get('/', authenticateToken, taskController.getAllTasks);
router.post('/', authenticateToken, taskController.createNewTask);

module.exports = router;