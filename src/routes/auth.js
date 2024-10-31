const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../../passportConfig');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/github/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/github/login' }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

module.exports = router;
