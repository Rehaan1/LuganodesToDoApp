const express = require('express')
const authRoute = require('./api/routes/auth')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = process.env.PORT || 4001

app.use('/user', authRoute)

app.get('/', (req, res) => {
  res.status(200).json({
    data: 'Namaste! Welcome to Auth Microservice'
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
