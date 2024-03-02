import mongoose from 'mongoose'

const companySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    experience:{
        type: String,
        required: true
    },
    levelImpact:{
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
},
{
    versionKey: false
})

export default mongoose.model('company', companySchema)