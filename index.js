require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')
const { response } = require('express')
app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('person', function (req, res) {
    return JSON.stringify(res.body)

})

app.use(morgan('tiny'))
app.use(morgan('person'))



const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))


app.get('/info', (request, response, next) => {
    const totalP = Person.countDocuments({})
        .then(count => { response.send(`<div><p>Phonebook has info for ${count} people</p><p> ${new Date()}</p></div>`) })
        .catch(error => next(error))



})

app.get('/api/persons', (request, response, next) => {
    const allPeople = Person.find({})
        .then(res => response.json(res))
        .catch(error => next(error))

})


app.get('/api/persons/:id', (request, response, next) => {
    const pid = request.params.id
    Person.findById(pid)
        .then(found => response.json(found))
        .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
       Person.findById(request.params.id)
       .then(per => Person.deleteOne(per))
       .catch(error=> next(error))
    

    response.status(204).end()
})

app.post('/api/persons/', (request, response, next) => {
    const pName = request.body.name
    const pNumber = request.body.number
    

    Person.find({name: pName})
    .then(res => {

        if (pNumber === "") {
            console.log(`error: number must be included in entry`)
            response.send(`error: number must be included in entry`)
            return;
        } else {
    
            //THIS line is important, it tells MONGO to use the Person Constructor module
            const newPerson = new Person({
                name: pName,
                number: pNumber
            })
    
            newPerson
            .save()
            .then(res => response.json(res))
            .catch(error => {next(error)
                 return error
            })   
        }
    })
    .catch(error =>{ return error})
    
})

app.put('/api/persons/:id', (request, response, next) =>{

    const person = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(res => response.json(res))
    .catch(error => next(error))
    
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    if(error.name === 'ValidationError') {
        return response.status(400).send(error.message)
        
    }
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)