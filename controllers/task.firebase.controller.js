const taskModel = require('../models/task.firebase.model');

async function getAllTasks(req, res) {
    const allTasks = await taskModel.getAllTasks();
    if (allTasks == null) {
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
        return;
    }
    allTasks.length > 0 ?
        res.status(200).json(allTasks) :
        res.status(404).json({ code: 404, message: "No se han encontrado datos" });
}

async function getTaskByID(req, res) {
    const {id} = req.params;
    const getTaskByID = await taskModel.getTaskByID(id);
    if (getTaskByID == null) {
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
        return;
    }
    getTaskByID != -1 ?
        res.status(200).json(getTaskByID) :
        res.status(404).json({ code: 404, message: "No se han encontrado datos" });
}

async function getAllUserTasks(req, res) {
    const {id} = req.params;
    const allUserTasks = await taskModel.getAllUserTasks(id);
    if (allUserTasks == null) {
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
        return;
    }
    allUserTasks.length > 0 ?
        res.status(200).json(allUserTasks) :
        res.status(404).json({ code: 404, message: "No se han encontrado datos" });
}

async function createNewTask(req, res) {
    const newTask = await taskModel.createNewTask(req.body);
    newTask != null ?
        res.status(201).json(newTask) :
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
}

async function editTask(req, res) {
    const {id} = req.params;
    const editedTask = await taskModel.editTask(id, req.body);
    if(editTask == null)
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
    editedTask != -1 ?
        res.status(201).json(editedTask) :
        res.status(404).json({ code: 404, message: "Dato a editar no encontrado" });
}

async function deleteTaskByID(req, res) {
    const {id} = req.params;
    const deteleTaskByID = await taskModel.deleteTaskByID(id);
    if (deteleTaskByID == null) {
        res.status(500).json({ code: 500, message: "Error interno del servidor" })
        return;
    }
    if (deteleTaskByID === -1) {
        res.status(404).json({ code: 404, message: "Dato a eliminar no encontrado" });
        return;
    }
    res.status(200).json(deteleTaskByID) 
}

module.exports = {
    getAllTasks,
    getTaskByID,
    getAllUserTasks,
    createNewTask,
    editTask,
    deleteTaskByID
}