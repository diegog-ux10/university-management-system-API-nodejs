require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./passportConfig');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'default',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    proxy: true // Add this if behind a reverse proxy
  }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

const studentRoutes = require('./src/routes/students');
app.use('/api/students', studentRoutes);

const courseRoutes = require('./src/routes/courses');
app.use('/api/courses', courseRoutes);

const facultyRoutes = require('./src/routes/faculty');
app.use('/api/faculty', facultyRoutes);

const departmentRoutes = require('./src/routes/departments');
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

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/', (req, res) => {
    res.render('index', { 
      user: req.session.user || req.user
    });
  });
  
  
const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
module.exports = app;