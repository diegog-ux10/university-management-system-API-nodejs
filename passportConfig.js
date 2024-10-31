const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    // Aquí puedes buscar o crear un usuario en tu base de datos
    // Por ahora, retornamos el perfil de GitHub
    return done(null, profile);
}));

// Serializar el usuario
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
