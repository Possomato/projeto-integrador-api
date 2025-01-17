require('express-async-errors')

const AppError = require('./utils/AppError')
const express = require('express')
const app = express()
const routes = require('./routes')

app.use(express.json())
app.use(routes)

app.use((error, req, res, next) => {
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error)

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

const door = 8080

app.listen(door, console.log(`estou te ouvindo na porta localhost/${door}`))