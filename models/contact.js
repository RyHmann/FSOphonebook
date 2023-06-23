const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const numberFormatValidator = (val) => {
    let reg = /^\d{2,3}[-]\d+$/
    return reg.test(val)
}

const numberLengthValidator = (val) => {
    return val.length  > 7
}

const phoneNumberValidator = [
    {validator: numberFormatValidator, message: 'Phone number requires a dash or hyphen'},
    {validator: numberLengthValidator, message: 'Phone number must be at least 8 digits long'}
]


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: phoneNumberValidator
    }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)