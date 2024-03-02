import express from 'express'
import { login, register, test } from '../controller/userController.js';

const api = express.Router();


api.get('/test', test)
api.post('/register', register)
api.post('/login', login)


export default api