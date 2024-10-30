const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'claveSecreta';
const JWT_EXPIRES_IN = '260s';

async function login(req, res, next, newUser = null) {
    const { username, password } = req.body;
    const user = userModel.getUserByUserName(username);

    if (!user) // Validar el usuario
        return res.status(401).json({ code: 401, message: "Credenciales no validas" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) // Validar la contraseña del usuario dado
        return res.status(401).json({ code: 401, message: "Credenciales no validas" });

    const token = jwt.sign(
        { username: user.username, },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
    return newUser == null ?
        res.status(200).json({ "code": 200, "message": "Inicio de sesión exitoso", "token": token }) :
        res.status(201).json({ "code": 201, "message": "Usuario creado e iniciado sesión", "new-user": newUser, "token": token });
}

function createUser(req, res, next) {
    try {
        const newUser = userModel.createUser(req.body);
        login(req, res, newUser);
    } catch (error) {
        res.status(400).json({ code: 400, message: "Error por parte del cliente" })
    }
}

module.exports = { login, createUser, JWT_SECRET };