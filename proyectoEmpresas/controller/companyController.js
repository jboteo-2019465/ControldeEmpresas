import Company from '../models/companyModel.js'
import Category from '../models/categoryModel.js'
import ExcelJS from 'exceljs'

//Crear una nueva empresa
export const createCompany = async(req, res)=>{
    try {
        let {name, experience, levelImpact, category} = req.body

        //Verificar si la empresa existe
        let existingCompany = await Company.findOne({name})
        if(existingCompany){
            return res.status(404).send({ message: 'Company alredy exists' });
        }
        //Verificar si la categoria existe
        let existingCategory = await Category.findOne({name: category})

        if(!existingCategory){
            existingCategory = new Category({
                name: category,
                description: `Categoria de ${category}`
            })
            await existingCategory.save()
        }
        const company = new Company({
            name,
            experience,
            levelImpact,
            category: existingCategory._id
        });

        (await company.save()).populate({
            path: 'category',
            select: 'name -_id'
        })

        res.status(201).send({message: 'Company created succesfully', company})
        
    } catch (err) {
        console.error(err)
        return res.status(404).send({message: 'Error creating Company'})
        
    }
}

//Actualizar
export const updateCompany = async(req, res)=>{
    try {
        let {id} = req.params
        const {name, experience, levelImpact, category} = req.body

        //Buscar si existe en la base de datos
        let comp = await Company.findById(id)
        if(!comp){
            return res.status(403).send({message: 'Company not found'})
        }

        comp.name = name || comp.name;
        comp.experience = experience || comp.experience;
        comp.levelImpact = levelImpact || comp.levelImpact;
        comp.category = category || comp.category;

        (await comp.save()).populate({
            path: 'category',
            select: 'name -_id'
        })
        res.send({ message: 'Company updated successfully', comp });
        
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Faild update comnpany'})
        
    }
}

//Obtener compañias
export const getCompany = async (req, res) => {
    try {
        let comp = await Company.find()
        return res.send({comp})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'company not found'})
    }
}

//Obtener filtrado por experiencia
export const getExperience = async (req, res) => {
    try {
        let data = req.body
        let compYears = await Company.find({experience: data.experience})
        if(!compYears){
            return res.status(500).send({message: 'Companys not found'});
        }
        return res.send({compYears})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Companies not found'})
    }
}

//Obtener filtrado por categoria
export const getCategory = async (req, res) => {
    try {
        let { id } = req.body
        let comp = await Company.find({_category: id}).populate({
            path: 'category',
            select: 'name -_id'
        })
        if (!comp) return res.status(404).send({message: 'Companies not found'});
        return res.send({comp});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Companies not found'});
    }
}

//Obtener filtrado de A a Z
export const getAZ = async (req, res) => {
    try {
        let az = await Company.find().sort({name: +1})
        return res.send({az});
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Not found company' });
    }
}

//Obtener de la Z a A
export const getZA = async (req, res) => {
    try {
        let az = await Company.find().sort({name: -1})
        return res.send({az});
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Not found company' });
    }
}

//Generación de excel recopilatorio de todas las empresas
export const generateExcel = async (req, res) => {
    try {
        // busca todas las empresas en la base de datos y pobla los campos de referencia 'category'
        let company = await Company.find().populate('category', ['description']);
        //crea el exel
        let book = new ExcelJS.Workbook();
        // Agrega una hoja llamada Companies
        let worksheet = book.addWorksheet('Companies');
        // esto define las columnas de exel
        worksheet.columns = [
            { header: 'name', key: 'nameCompany', width: 20 },
            {header: 'experience', key: 'experience', width: 20 },
            {header: 'levelImpact', key: 'levelImpact', width: 20 },
            { header: 'Description', key: 'description', width: 40 }
        ];

         // itera sobre las empresas y agrega una fila para cada una en la hoja de trabajo
        company.forEach(company => {
            worksheet.addRow({
                nameCompany: company.name,
                experience: company.experience,
                levelImpact: company.levelImpact,
                description: company.category.description 
            });
        });

        // escribe el libro de Excel en un archivo llamado CompanyExcel
        let filePath = 'CompanyExcel.xlsx';
        await book.xlsx.writeFile(filePath);
        // establece la cabecera de la respuesta HTTP para que el navegador descargue el archivo Excel
        res.attachment(filePath);
        // esto envia el exel como respuesta 
        res.send({message: 'Excel generated'});
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error generating Excel', error: error });
    }
}