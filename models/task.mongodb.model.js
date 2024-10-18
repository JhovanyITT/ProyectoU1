const { v4: uuidv4 } = require('uuid');
const { getMongoConnection } = require('../connections/mongodb.connection');

async function getAllTasks() {
    try {
        const database = await getMongoConnection();
        const tasks = await database
            .collection('tasks')
            .find()
            .toArray();
        return tasks;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getTaskByID(id = "") {
    try {
        const database = await getMongoConnection();
        const task = await database
            .collection('tasks')
            .findOne({ _id: id });
        return task != null ? task : -1;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAllUserTasks(id) {
    try {
        const database = await getMongoConnection();
        const tasks = await database
            .collection('tasks')
            .find({ fk_user_id: id })
            .toArray();
        return tasks;
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function createNewTask(data) {
    try {
        const database = await getMongoConnection();
        const newTask = {
            _id: uuidv4(),
            fk_user_id: data.fk_user_id,
            title: data.title,
            body: data.body,
            creation_date: new Date().toLocaleString(),
            completed: data.completed
        }
        const serverResult = await database
            .collection('tasks')
            .insertOne(newTask);
        const result = {
            serverResult: serverResult,
            newTask: newTask
        }
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function editTask(id, data) {
    var oldTaskData = await getTaskByID(id);
    if (oldTaskData == null) return -1;

    const editedTask = {
        fk_user_id: oldTaskData.fk_user_id,
        title: data.title,
        body: data.body,
        creation_date: oldTaskData.creation_date,
        completed: data.completed
    }

    try {
        const database = await getMongoConnection();
        const serverResult = await database.collection('tasks').updateOne(
            { _id: id },
            { $set: editedTask }
        );
        if (serverResult.modifiedCount === 0) return -1;

        const result = {
            oldTask: oldTaskData,
            editedTask: editedTask
        }
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deteleTaskByID(id) {
    var oldTaskData = await getTaskByID(id);
    if (oldTaskData == -1) return -1;
    try {
        const database = await getMongoConnection();
        const task = await database
            .collection('tasks')
            .findOneAndDelete({ _id: id })
        return task;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getAllTasks,
    getTaskByID,
    getAllUserTasks,
    createNewTask,
    editTask,
    deteleTaskByID
}