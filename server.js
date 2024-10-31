const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
const YAML = require('yamljs');
const cors = require('cors');
const GitHubStrategy = require('passport-github2').Strategy;

const swaggerDocument = YAML.load('./swagger.yaml');

const courseRoutes = require('./src/routes/courses');
const facultyRoutes = require('./src/routes/faculty');
const departmentRoutes = require('./src/routes/departments');
const studentRoutes = require('./src/routes/students');
const authRoutes = require('./src/routes/auth');
const errorHandler = require('./src/middlewares/errorHandler');

require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10kb' }));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            imgSrc: ["'self'", 'data:', 'https://github.com', 'https://*.githubusercontent.com'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
            fontSrc: ["'self'", 'https:', 'data:'],
        },
    }
}));

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    maxAge: 3600
};
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.SESSION_SECRET || 'default',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    },
    proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    console.log('Authentication callback received');
    console.log('GitHub profile:', profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user);
    done(null, user);
});

app.set('view engine', 'ejs');
app.set('views', './src/views');

if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log('Session:', {
            id: req.sessionID,
            user: req.session.user,
            authenticated: req.isAuthenticated ? req.isAuthenticated() : false
        });
        next();
    });
}

app.get('/', (req, res) => {
    console.log('User data in req:', req.user);
    res.render('index', {
        user: req.session.user || req.user
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);

app.use('/api/students', studentRoutes);

app.use('/api/courses', courseRoutes);

app.use('/api/faculty', facultyRoutes);

app.use('/api/departments', departmentRoutes);

app.get('/oauth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;