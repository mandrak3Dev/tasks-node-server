const express = require('express');
const PORT = process.env.PORT || 4000;
const concetarDB =  require('./config/db');
const cors = require('cors');

const app = express();
concetarDB();

// Habilitar cors
app.use(cors());

app.use(express.json({extended: true}));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
})