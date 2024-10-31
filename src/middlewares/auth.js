const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/github');
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Leer el token del header

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        req.user = verified; // Agregar el usuario a req para usarlo en las rutas
        next(); // Continuar con la siguiente función
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

module.exports = {ensureAuthenticated, verifyToken};