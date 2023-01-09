import express from 'express';
import * as dotenv from "dotenv";
dotenv.config();
import router from './routes/auth.js';
import cors from "cors";
import { dbConnection } from './db/config.js';
import path from 'path';

console.log(process.env);

//crear el servidor/aplicacion de express
const app = express();

//Base de datos
dbConnection();

//directorio publico
app.use(express.static('public'));

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use( '/api/auth', router);

//manejar rutas
app.get('*', (req , res) =>{
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});