// Imports de las librerías a usar
const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');

const app = require('../index');
const taskController = require('../controllers/taskController');

const expect = chai.expect;

//#region Escenarios de prueba del CRUD en MongoDB

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