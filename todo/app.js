const express = require('express')
const todoRoute = require('./api/routes/todos')
const cors = require('cors')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3001

// Route for Todo endpoint services
app.use('/todo', todoRoute)

app.get('/', (req, res) => {
  res.status(200).json({
    data: 'Hola, Amigo! Welcome to ToDo Microservice'
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})