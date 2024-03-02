import express from 'express'
import {authMiddleware} from '../middleWare/validateMiddleWare.js'
import { createCompany, generateExcel, getAZ, getCategory, getCompany, getExperience, getZA, updateCompany } from '../controller/companyController.js';

const api = express.Router();


api.post('/createCompany', createCompany)
api.put('/updateCompany/:id', authMiddleware, updateCompany)
api.get('/getCompanys', authMiddleware, getCompany)
api.post('/getExperience', authMiddleware, getExperience)
api.post('/getCategory', authMiddleware, getCategory)
api.get('/getAZ', authMiddleware, getAZ)
api.get('/getZA', authMiddleware, getZA)
api.get('/generateExcel', authMiddleware, generateExcel)



export default api