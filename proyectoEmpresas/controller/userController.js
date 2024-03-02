import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const test = (req, res)=>{
    console.log('test running')
    return res.send({message: 'Test is running'})
}
//Registro
export const register = async (req, res)=>{
    try {
        let data = req.body
        let {username, email} = req.body
        let dataUse = await User.findOne({
            $or:[{
                username
            },{
                email
            }]
        })
        if(dataUse){
            return res.status(500).send({message: 'username or/and email in use'})
        }
        data.password = await bcrypt.hash(data.password, 10)
        let user = new User(data)
        await user.save();

        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })


        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user' });
        
    }
}

//Inicio de sesión
export const login = async (req, res) => {
    try {
        let { usernameoremail, password } = req.body;

        let user = await User.findOne({ 
            $or: [
                { username: usernameoremail },
                { email: usernameoremail }
            ]
        }) 

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Verificar la contraseña
        let isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        // Generar token de autenticación
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });

        // Responder con un mensaje de éxito y el token
        res.json({ message: `Login successful. Welcome ${user.username}`, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};