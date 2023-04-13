require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')



const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})


app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({
        error: 'name missing'
      })
    }
  
    if (!body.number) {
      return response.status(400).json({
        error: 'number missing'
      })
    }
  
    Person.findOne({ name: body.name })
      .then(existingPerson => {
        if (existingPerson) {
          return response.status(400).json({
            error: 'name must be unique'
          })
        }
  
        const person = new Person({
          name: body.name,
          number: body.number
        })
  
        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
      })
  })
  


  app.get('/api/persons', (request, response) => {
    Person.find({})
      .then(persons => {
        response.json(persons)
      })
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})