const { v4: uuidv4 } = require('uuid');
const db = require("../connections/firebase.connection");


async function getAllTasks() {
    try {
        const snapshot = await db.collection('tasks').get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return tasks;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getTaskByID(id = "") {
    try {
        const taskRef = db.collection('tasks').doc(id);
        const task = await taskRef.get();
        return task.exists ? { id: task.id, ...task.data() } : -1;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAllUserTasks(userId) {
    try {
        const snapshot = await db.collection('tasks').where('fk_user_id', '==', userId).get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return tasks;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function createNewTask(data) {
    const taskId = uuidv4();
    const newTask = {
        fk_user_id: data.fk_user_id,
        title: data.title,
        body: data.body,
        creation_date: new Date().toLocaleString(),
        completed: data.completed
    };
    
    await db.collection('tasks').doc(taskId).set(newTask);

    return { id: taskId, ...newTask };
}


async function editTask(id, data) {
    const taskRef = db.collection('tasks').doc(id);
    const oldTaskData = await getTaskByID(id);
    if (oldTaskData === -1) return -1;

    const editedTask = {
        ...oldTaskData,
        fk_user_id: oldTaskData.fk_user_id,
        title: data.title,
        body: data.body,
        completed: data.completed
    };

    try {
        await taskRef.update(editedTask);
        return { oldTask: oldTaskData, editedTask: editedTask };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteTaskByID(id) {
    const taskRef = db.collection('tasks').doc(id);
    const oldTaskData = await getTaskByID(id);
    if (oldTaskData === -1) return -1;
    
    try {
        await taskRef.delete();
        return oldTaskData;
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
    deleteTaskByID
};
