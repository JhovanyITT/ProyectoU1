const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
//const tasksMongoRoutes = require('./routes/task.mongodb.routes');
const tasksFirebase = require('./routes/task.firebase.routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
//app.use('/api/mongodb/task', tasksMongoRoutes);
app.use('/api/firebase/task', tasksFirebase);


app.use((req, res, next) => {
    res.status(404).json({ code: 404, message: "Ruta no encontrada" });
});

module.exports = app;
