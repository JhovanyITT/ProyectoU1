const { v4: uuidv4 } = require('uuid');
const { admin } = require('../connections/firebase.connection');
const db = admin.firestore();

async function getAllProjects() {
    try {
        const query = db.collection('projects');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            startDate: doc.data().startDate,
            endDate: doc.data().endDate,
            status: doc.data().status,
            budget: doc.data().budget
        }));
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function createNewProject(data) {
    const newProject = {
        id: uuidv4(),
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        budget: data.budget
    };

    try {
        await db
            .collection('projects')
            .doc(`/${newProject.id}/`)
            .create(newProject);
        return newProject;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    getAllProjects,
    createNewProject
}