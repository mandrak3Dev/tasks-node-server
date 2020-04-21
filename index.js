const express = require('express');
const PORT = process.env.PORT || 4000;
const concetarDB =  require('./config/db');

const app = express();
concetarDB();

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
})