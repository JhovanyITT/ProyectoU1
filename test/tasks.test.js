// Imports de las librerías a usar
const request = require('supertest');
const chai = require('chai');

const app = require('../index').app;

const expect = chai.expect;

//Variables para realizar el Test
let token;
let idTask;
let dateTask;
let oldTask;

//#region Escenarios de prueba del CRUD en MongoDB

//Prueba #1: GET All TASK - MongoDB
describe('GET ALL TASKS /api/mongodb/task', () => {

    // Como primer paso nos autenticamos para poder realizar la consulta
    before(async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
    });

    //Seguidamente con el token valido realizamos la consulta
    it('1, Deberia devolver todas las tareas con estatus 200 cuando hay tareas en MongoDB', async () => {
        const res = await request(app).get('/api/mongodb/task').set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        res.body.forEach(task => {
            expect(task).to.include.keys('_id', 'fk_user_id', 'title', 'body', 'creation_date', 'completed');
            expect(task._id).to.be.a('string');
            expect(task.fk_user_id).to.be.a('string');
            expect(task.title).to.be.a('string')
            expect(task.body).to.be.a('string');
            expect(task.completed).to.be.oneOf([true, false]);
        });

    });
});

//Prueba #2: GET TASK BY ID - MongoDB
describe('GET TASK BY ID /api/mongodb/task/:id', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
        res = await request(app).post('/api/mongodb/task').send({ fk_user_id: 'admin', title: 'Tarea  de Prueba', body: 'Esto es una tarea de Testeo :0', completed: false }).set('Authorization', `Bearer ${token}`);
        idTask = res.body.newTask._id;
        dateTask = res.body.newTask.creation_date;
        expect(idTask).to.be.a('string');
        expect(dateTask).to.be.a('string');
    });

    it('2, Deberia devolver una tarea con estatus 200 cuando la tarea corresponde con el ID en MongoDB', async () => {
        const task = {
            _id: idTask,
            fk_user_id: 'admin',
            title: 'Tarea  de Prueba', 
            body: 'Esto es una tarea de Testeo :0',
            creation_date: dateTask,
            completed: false
        };
        const res = await request(app).get(`/api/mongodb/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('_id', 'fk_user_id', 'title', 'body', 'creation_date', 'completed');
        expect(res.body).to.deep.equal(task);
    });
});

//Prueba #3: GET ALL USER TASKS - MongoDB
describe('GET ALL USER TASKS /api/mongodb/task/user/:id', () => {

    // Como primer paso nos autenticamos para poder realizar la consulta
    before(async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
    });

    //Seguidamente con el token valido realizamos la consulta
    it('3, Deberia devolver todas las tareas con estatus 200 cuando hay tareas del usuario indicado en MongoDB', async () => {
        const res = await request(app).get('/api/mongodb/task/user/admin').set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        res.body.forEach(task => {
            expect(task).to.include.keys('_id', 'fk_user_id', 'title', 'body', 'creation_date', 'completed');
            expect(task._id).to.be.a('string');
            expect(task.fk_user_id).to.be.a('string').to.equal('admin');
            expect(task.title).to.be.a('string')
            expect(task.body).to.be.a('string');
            expect(task.completed).to.be.oneOf([true, false]);
        });

    });
});

//Prueba #4: CREATE NEW TASK - MongoDB
describe('CREATE NEW TASK /api/mongodb/task', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
    });

    it('4, Deberia devolver la tarea creada MongoDB con estatus 201', async () => {
        const res = await request(app).post('/api/mongodb/task').send({ fk_user_id: 'admin', title: 'Tarea  de Prueba 2', body: 'Esto es una tarea de Testeo Ditto', completed: false }).set('Authorization', `Bearer ${token}`);
        idTask = res.body.newTask._id;
        dateTask = res.body.newTask.creation_date;
        const task = {
            serverResult: {
		        acknowledged: true,
		        insertedId: idTask
	        },
            newTask:{
                _id: idTask,
                fk_user_id: 'admin',
                title: 'Tarea  de Prueba 2', 
                body: 'Esto es una tarea de Testeo Ditto',
                creation_date: dateTask,
                completed: false
            }
        };
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(task);
        expect(res.body.newTask.completed).to.be.oneOf([true, false]);
    });
});

//Prueba #5: EDIT TASK - MongoDB
describe('EDIT TASK /api/mongodb/task/:id', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
        res = await request(app).get(`/api/mongodb/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        oldTask = res.body;
    });

    it('5, Deberia devolver la tarea actualizada y la tarea antes de la modificación con estatus 201', async () => {
        const res = await request(app).put(`/api/mongodb/task/${idTask}`).send({ title: 'Tarea Actualizada', body: 'Esto es una tarea Actualizada', completed: true }).set('Authorization', `Bearer ${token}`);
        const task = {
            oldTask: 
                oldTask,
            editedTask: {
                fk_user_id: 'admin',
                title: 'Tarea Actualizada',
                body: 'Esto es una tarea Actualizada',
                creation_date: oldTask.creation_date,
                completed: true
	        }
        };
        expect(res.status).to.equal(201);
        expect(res.body.editedTask.title).to.be.a('string');
        expect(res.body.editedTask.body).to.be.a('string');
        expect(res.body.editedTask.completed).to.be.oneOf([true, false]);
        expect(res.body).to.deep.equal(task);
    });
});

//Prueba #6: DELETE TASK BY ID - MongoDB
describe('DELETE TASK /api/mongodb/task/:id', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
        res = await request(app).get(`/api/mongodb/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        oldTask = res.body;
    });

    it('6, Deberia devolver la tarea eliminada con estatus 200', async () => {
        const res = await request(app).delete(`/api/mongodb/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(oldTask);
    });
});

//#endregion

//#region Escenarios de prueba del CRUD en Firebase

//Prueba #7: GET All TASK - Firebase
describe('GET ALL TASKS /api/firebase/task', () => {

    // Como primer paso nos autenticamos para poder realizar la consulta
    before(async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
    });

    //Seguidamente con el token valido realizamos la consulta
    it('7, Deberia devolver todas las tareas con estatus 200 cuando hay tareas en Firebase', async () => {
        const res = await request(app).get('/api/firebase/task').set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        res.body.forEach(task => {
            expect(task).to.include.keys('_id', 'fk_user_id', 'title', 'body', 'creation_date', 'completed');
            expect(task._id).to.be.a('string');
            expect(task.fk_user_id).to.be.a('string');
            expect(task.title).to.be.a('string')
            expect(task.body).to.be.a('string');
            expect(task.completed).to.be.oneOf([true, false]);
        });

    });
});

//Prueba #8: GET TASK BY ID - Firebase
describe('GET TASK BY ID /api/firebase/task/:id', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
        res = await request(app).post('/api/firebase/task').send({ fk_user_id: 'admin', title: 'Tarea  de Prueba', body: 'Esto es una tarea de Testeo :0', completed: false }).set('Authorization', `Bearer ${token}`);
        idTask = res.body.newTask._id;
        dateTask = res.body.newTask.creation_date;
        expect(idTask).to.be.a('string');
        expect(dateTask).to.be.a('string');
    });

    it('8, Deberia devolver una tarea con estatus 200 cuando la tarea corresponde con el ID en Firebase', async () => {
        const task = {
            _id: idTask,
            fk_user_id: 'admin',
            title: 'Tarea  de Prueba', 
            body: 'Esto es una tarea de Testeo :0',
            creation_date: dateTask,
            completed: false
        };
        const res = await request(app).get(`/api/firebase/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('_id', 'fk_user_id', 'title', 'body', 'creation_date', 'completed');
        expect(res.body).to.deep.equal(task);
    });
});

//Prueba #9: GET ALL USER TASKS - Firebase
describe('GET ALL USER TASKS /api/firebase/task/user/:id', () => {

    // Como primer paso nos autenticamos para poder realizar la consulta
    before(async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
    });

    //Seguidamente con el token valido realizamos la consulta
    it('9, Deberia devolver todas las tareas con estatus 200 cuando hay tareas del usuario indicado en Firebase', async () => {
        const res = await request(app).get('/api/firebase/task/user/admin').set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        res.body.forEach(task => {
            expect(task).to.include.keys('_id', 'fk_user_id', 'title', 'body', 'creation_date', 'completed');
            expect(task._id).to.be.a('string');
            expect(task.fk_user_id).to.be.a('string').to.equal('admin');
            expect(task.title).to.be.a('string')
            expect(task.body).to.be.a('string');
            expect(task.completed).to.be.oneOf([true, false]);
        });

    });
});

//Prueba #10: CREATE NEW TASK - Firebase
describe('CREATE NEW TASK /api/firebase/task', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
    });

    it('10, Deberia devolver la tarea creada Firebase con estatus 201', async () => {
        const res = await request(app).post('/api/firebase/task').send({ fk_user_id: 'admin', title: 'Tarea  de Prueba 2', body: 'Esto es una tarea de Testeo Ditto', completed: false }).set('Authorization', `Bearer ${token}`);
        idTask = res.body.newTask._id;
        dateTask = res.body.newTask.creation_date;
        const task = {
            serverResult: {
		        acknowledged: true,
		        insertedId: idTask
	        },
            newTask:{
                _id: idTask,
                fk_user_id: 'admin',
                title: 'Tarea  de Prueba 2', 
                body: 'Esto es una tarea de Testeo Ditto',
                creation_date: dateTask,
                completed: false
            }
        };
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(task);
        expect(res.body.newTask.completed).to.be.oneOf([true, false]);
    });
});

//Prueba #11: EDIT TASK - Firebase
describe('EDIT TASK /api/firebase/task/:id', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
        res = await request(app).get(`/api/firebase/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        oldTask = res.body;
    });

    it('11, Deberia devolver la tarea actualizada y la tarea antes de la modificación con estatus 201', async () => {
        const res = await request(app).put(`/api/firebase/task/${idTask}`).send({ title: 'Tarea Actualizada', body: 'Esto es una tarea Actualizada', completed: true }).set('Authorization', `Bearer ${token}`);
        const task = {
            oldTask: 
                oldTask,
            editedTask: {
                fk_user_id: 'admin',
                title: 'Tarea Actualizada',
                body: 'Esto es una tarea Actualizada',
                creation_date: oldTask.creation_date,
                completed: true
	        }
        };
        expect(res.status).to.equal(201);
        expect(res.body.editedTask.title).to.be.a('string');
        expect(res.body.editedTask.body).to.be.a('string');
        expect(res.body.editedTask.completed).to.be.oneOf([true, false]);
        expect(res.body).to.deep.equal(task);
    });
});

//Prueba #12: DELETE TASK BY ID - Firebase
describe('DELETE TASK /api/firebase/task/:id', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
        res = await request(app).get(`/api/firebase/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        oldTask = res.body;
    });

    it('12, Deberia devolver la tarea eliminada con estatus 200', async () => {
        const res = await request(app).delete(`/api/firebase/task/${idTask}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(oldTask);
    });
});

//#endregion