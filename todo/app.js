const express = require('express')
const todoRoute = require('./api/routes/todos')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = process.env.PORT || 3001

app.use('/todo', todoRoute)

app.get('/', (req, res) => {
  res.status(200).json({
    data: 'Hola, Amigo! Welcome to ToDo Microservice'
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})