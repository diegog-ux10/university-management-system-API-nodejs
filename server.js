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

// Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Cargar el archivo de especificación de Swagger
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importar y usar rutas de autenticación
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

// Importar y usar rutas de estudiantes
const studentRoutes = require('./src/routes/students');
app.use('/api/students', studentRoutes);

// Importar y usar rutas de cursos
const courseRoutes = require('./src/routes/courses');
app.use('/api/courses', courseRoutes);

// Importar y usar rutas de facultades
const facultyRoutes = require('./src/routes/faculty');
app.use('/api/faculty', facultyRoutes);

// Importar y usar rutas de departamentos
const departmentRoutes = require('./src/routes/departments');
app.use('/api/departments', departmentRoutes);

// Ruta de logout para GitHub
app.get('/oauth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Ruta de logout para JWT (solo para que el cliente elimine el token)
app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
