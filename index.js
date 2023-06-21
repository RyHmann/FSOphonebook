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

app.get('/info', (request, response) => {
    var dateTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${dateTime}</p>`)
})

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contact => {
        response.json(contact)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Contact
        .findById(request.params.id)
        .then(contact => response.json(contact))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id);
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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
