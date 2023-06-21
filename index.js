require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan('tiny'))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }
}
app.use(errorHandler)

app.get('/info', (request, response) => {
    var dateTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${dateTime}</p>`)
})

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contact => {
        if (contact) {
            response.json(contact)
        } else {
            response.status(404).end()
        }
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Contact
        .findById(request.params.id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => {
            error => next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch((error) => {
            error => next(error)
        })
})

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    }

    const person = new Contact({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {response.json(savedPerson)})
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    Contact.findByIdAndUpdate(request.params.id, {number: body.number}, {new: true})
           .then(result => {
            response.json(result)
        })
           .catch((error) => {
            error => next(error)
           })
})
