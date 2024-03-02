import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requires: true,
        unique: true
    },
    name:{
        type: String,
        reuired: true
    },
    surname:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }

})

const User = mongoose.model('User', userSchema);
export default User