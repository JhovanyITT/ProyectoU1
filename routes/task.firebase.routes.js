const express = require('express');
const taskController = require('../controllers/task.firebase.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/',  taskController.getAllTasks);
router.get('/:id',  taskController.getTaskByID);
router.get('/user/:id',  taskController.getAllUserTasks);
router.post('/',  taskController.createNewTask);
router.put('/:id', taskController.editTask);
router.delete('/:id', taskController.deleteTaskByID);

module.exports = router;
