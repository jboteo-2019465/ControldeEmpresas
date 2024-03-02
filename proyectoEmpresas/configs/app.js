import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './mongo.js'
import helmet from 'helmet';
import userRoutes from '../routes/userRoutes.js'
import companyRoutes from '../routes/companyRoutes.js'


dotenv.config()

export const app = express();
const PORT = process.env.PORT || 3000;

//Conectar a la base de datos
connectDB();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(helmet());

//Rutas
app.use(userRoutes)
app.use(companyRoutes)


app.get('/', (req, res)=>{
    res.send('Welcome to Company Manager')
});

export default app;