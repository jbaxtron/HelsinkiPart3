const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('note', function(req,res) {
    return JSON.stringify(res.body)
    
})

  

app.use(morgan('tiny')) 
app.use(morgan('note'))
//app.use(morgan(':method :url :status :response-time ms,'))

//morgan.token('type', function (req, res) { return json.stringify(res.body)})

let persons = [
    {
        "name": "Jerry Smith",
        "number": "453616851",
        "id": 8
    },
    {
        "name": "Scarlett Johanson",
        "number": "68461",
        "id": 9
    },
    {
        "name": "Captain America",
        "number": "68461255",
        "id": 10
    },
    {
        "name": "Incredible Hulk",
        "number": "921615156",
        "id": 11
    },
    {
        "name": "Thor",
        "number": "I do like iPhones though",
        "id": 12
    },
    {
        "name": "Bucky Barnes",
        "number": "54253521",
        "id": 13
    },
    {
        "name": "Baron Mordo",
        "number": "5425352155",
        "id": 14
    },
    {
        "name": "Dr Strange",
        "number": "444456565",
        "id": 15
    },
    {
        "name": "Tony Stark",
        "number": "684984968541",
        "id": 16
    },
    {
        "name": "Natasha Romanov",
        "number": "6849849685415",
        "id": 17
    },
    {
        "name": "Loki",
        "number": "34566578",
        "id": 18
    },
    {
        "name": "Thanos",
        "number": "8989798",
        "id": 19
    },
    {
        "name": "Dormamu",
        "number": "89897986",
        "id": 20
    },
    {
        "name": "Master Chief",
        "number": "656548541",
        "id": 21
    },
    {
        "name": "Rick Sanchez",
        "number": "6565485418",
        "id": 22
    },
    {
        "name": "Morty Smith",
        "number": "65654854187",
        "id": 23
    },
    {
        "name": "The Doctor",
        "number": "78456132",
        "id": 24
    }
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p> ${new Date()}</p></div>`)


})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const personForReturn = persons.find(x => x.id === Number(request.params.id))
    if(personForReturn){
    response.json(personForReturn)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(x => x.id !== id)

    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const pName = request.body.name
    const pNumber = request.body.number
    const pId = Math.floor(Math.random()*1000)

    const fNames = persons.map(person => person.name)
    if (fNames.includes(pName)){
        console.log(`error : name already exists in the Phonebook`)
        response.send(`error : name already exists in the Phonebook`)
        return;
    }
    if(pNumber==="") {
        console.log(`error: number must be included in entry`)
        response.send(`error: number must be included in entry`)
        return;
    }else{

    const newPerson = {
        name: pName, 
        number: pNumber,
        id: pId
    }

    persons.push(newPerson)
    response.json(persons)
    }
})