require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', function (req) {return JSON.stringify(req.body)})
app.use(morgan('tiny'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
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
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

morgan.token('body', function (req) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Contact({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = new Contact({
    _id: request.params.id,
    name: body.name,
    number: body.number
  })

  Contact.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(result => response.json(result))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    console.log('error hit: ', error.message)
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
