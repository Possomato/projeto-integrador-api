const {Router} = require('express')
const userRoutes = Router()

const UserControllers = require('../controllers/UserControllers')
const userControllers = new UserControllers()

function myMiddleware(req, res, next){
  const {name, email, password} = req.body

  !name ? res.send('sem nome!') : next()
}

userRoutes.post('/', userControllers.create)
userRoutes.put('/:id', userControllers.update)

module.exports = userRoutes