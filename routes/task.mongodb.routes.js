const express = require('express');
const taskController = require('../controllers/task.mongodb.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken,taskController.getAllTasks);
router.get('/:id',  authenticateToken, taskController.getTaskByID);
router.get('/user/:id',  authenticateToken, taskController.getAllUserTasks);
router.post('/',  authenticateToken, taskController.createNewTask);
router.put('/:id', authenticateToken, taskController.editTask);
router.delete('/:id', authenticateToken, taskController.deleteTaskByID);


module.exports = router;