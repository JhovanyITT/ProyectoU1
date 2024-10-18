const projectModel = require('../models/task.firebase.model');

async function getAllTasks(req, res) {
    const allTasks = await taskModel.getAllProjects();
    if (allTasks == null) {
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
        return;
    }
    allTasks.length > 0 ?
        res.status(200).json(allTasks) :
        res.status(404).json({ code: 404, message: "No se han encontrado datos" });
}

async function createNewTask(req, res) {
    const newTask = await taskModel.createNewTask(req.body);
    newTask != null ?
        res.status(201).json(newTask) :
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
}

module.exports = {
    getAllTasks,
    createNewTask
}