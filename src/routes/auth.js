const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../passportConfig');

// Ruta de registro para autenticación con JWT
router.post('/register', authController.register);

// Ruta de login para autenticación con JWT
router.post('/login', authController.login);

// Ruta de autenticación con GitHub (OAuth)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub tras la autenticación
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Redirige a la página deseada después de autenticarse correctamente
        res.redirect('/api/students');
    }
);

// Exportar el router para su uso en server.js
module.exports = router;
