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

//Prueba #1: GET All TASK
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

//Prueba #2: GET TASK BY ID
describe('GET TASK BY ID /api/mongodb/task/:id', () => {

    before(async () => {
        let res = await request(app).post('/api/auth/login').send({ username: 'admin', password: '12345' });
        token = res.body.token;
        expect(token).to.be.a('string');
        res = await request(app).post('/api/mongodb/task').send({ fk_user_id: 'admin', title: 'Tarea  de Prueba', body: 'Esto es una tarea de Testeo :0', completed: false });
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

//Prueba #3: GET ALL USER TASKS
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

//Prueba #4: CREATE NEW TASK
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

//Prueba #5: EDIT TASK
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

//Prueba #6: DELETE TASK BY ID
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

//#region Escenarios de prueba del CRUD en FireBase

//#endregion

// Muestreo de como hice mis pruebas

// // Prueba #1 Get de los proyectos
// describe('GET /projects/', () => {
//   it('1. Debería de devolver un estado 200 cuando hay proyectos', async () => {
//     const arrProjects = [
//       {
//         id: 1,
//         name: "Proyecto 1",
//         description: "Descripción proyecto 1",
//         startDate: "2024-06-23",
//         endDate: "2024-06-23",
//         status: "en progreso",
//         teamMembers: ["Persona 1", "Persona 2"],
//         budget: 120000
//       },
//       {
//         id: 2,
//         name: "Proyecto 2",
//         description: "Descripción proyecto 2",
//         startDate: "2024-08-20",
//         endDate: "2024-12-30",
//         status: "en progreso",
//         teamMembers: ["Persona 3", "Persona 4"],
//         budget: 210000
//       }
//     ];

//     const res = await request(app).get('/projects/');
//     expect(res.status).to.equal(200);
//     expect(res.body).to.be.an('array');
//     expect(res.body.length).to.equal(2);
//     expect(res.body).to.deep.equal(arrProjects);
//   });
// });

// // Prueba #2 Get de los proyectos
// describe('GET /projects/1', () => {
//   it('2. Debería de devolver un estado 200 cuando hay un proyecto con el ID 1', async () => {
//     const interestProyect =
//     {
//       id: 1,
//       name: "Proyecto 1",
//       description: "Descripción proyecto 1",
//       startDate: "2024-06-23",
//       endDate: "2024-06-23",
//       status: "en progreso",
//       teamMembers: ["Persona 1", "Persona 2"],
//       budget: 120000
//     };

//     const res = await request(app).get('/projects/1');
//     expect(res.status).to.equal(200);
//     expect(res.body).to.be.an('object');
//     expect(res.body).to.deep.equal(interestProyect);
//   });
// });

// // Prueba #3 Post de los proyectos
// describe('POST /projects/', () => {
//   it('3. Debería de devolver un estado 200 cuando se agrega un proyecto', async () => {
//     const newProject =
//     {
//       name: "Proyecto de prueba",
//       description: "Proyecto creado desde el entorno de prueba de mocha",
//       startDate: "2024-06-23",
//       endDate: "2024-06-23",
//       status: "en progreso",
//       teamMembers: ["Persona 1", "Persona 2"],
//       budget: 165000
//     }

//     const res = await request(app).post('/projects/').send(newProject);
//     expect(res.status).to.equal(200);
//     expect(res.body).to.be.an('object');
//     expect(res.body).to.include.keys('id', 'name', 'description', 'startDate', 'endDate', 'status', 'teamMembers', 'budget');
//     // Validando los datos del JSON en profundidad
//     expect(res.body.name).to.equal(newProject.name);
//     expect(res.body.description).to.equal(newProject.description);
//     expect(res.body.startDate).to.equal(newProject.startDate);
//     expect(res.body.endDate).to.equal(newProject.endDate);
//     expect(res.body.status).to.equal(newProject.status);
//     expect(res.body.budget).to.equal(newProject.budget);
//   });
// });

// // Prueba #4 Put de los proyectos colocamos el proyecto 3 ya que es el proyecto que se creo con anterioridad
// describe('PUT /projects/3', () => {
//   it('4. Debería de devolver un estado 201 cuando se edita un proyecto', async () => {
//     const editedProject =
//     {
//       name: "Proyecto de prueba -- Editado",
//       description: "Proyecto creado desde el entorno de prueba de mocha -- Editado",
//       startDate: "2024-06-23",
//       endDate: "2025-06-23",
//       status: "completado",
//       teamMembers: ["Persona 1", "Persona 2"],
//       budget: 165000
//     }

//     const res = await request(app).put('/projects/3').send(editedProject);
//     expect(res.status).to.equal(201);
//     expect(res.body).to.be.an('object');
//     expect(res.body).to.include.keys('id', 'name', 'description', 'startDate', 'endDate', 'status', 'teamMembers', 'budget');

//     // Validando los datos del JSON en profundidad
//     expect(res.body.id).to.equal(3);
//     expect(res.body.name).to.equal(editedProject.name);
//     expect(res.body.description).to.equal(editedProject.description);
//     expect(res.body.startDate).to.equal(editedProject.startDate);
//     expect(res.body.endDate).to.equal(editedProject.endDate);
//     expect(res.body.status).to.equal(editedProject.status);
//     expect(res.body.budget).to.equal(editedProject.budget);
//   });
// });

// // Prueba #5 Delete de los proyectos colocamos el proyecto 3 ya que es el proyecto que se creo con anterioridad
// describe('DELETE /projects/3', () => {
//   it('5. Debería de devolver un estado 200 cuando se elimina un proyecto', async () => {
//     const res = await request(app).delete('/projects/3');
//     expect(res.status).to.equal(200);
//     expect(res.body).to.be.an('object');
//     expect(res.body).to.include.keys('id', 'name', 'description', 'startDate', 'endDate', 'status', 'teamMembers', 'budget');

//     // Validando los datos del JSON en profundidad
//     expect(res.body.id).to.equal(3);
//   });
// });