const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../controllers/auth.controller').JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(403).json({ code: 403, message: "Token requerido" });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            switch (err.name) {
                case 'JsonWebTokenError':
                    return res.status(403).json({ code: 403, message: "Token inválido" });
                case 'TokenExpiredError':
                    return res.status(401).json({ code: 401, message: "Token expirado, inicie de nuevo sesión" });
                default:
                    return res.status(409).json({ code: 409, message: "Error, no hay información concluyente" });
            }
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;