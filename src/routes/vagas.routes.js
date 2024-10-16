const {Router} = require('express')
const vagasRoutes = Router()

const VagasControllers = require('../controllers/VagasControllers')
const vagasControllers = new VagasControllers()


vagasRoutes.post('/:user_id', vagasControllers.create)
vagasRoutes.get('/', vagasControllers.index)
vagasRoutes.get('/:id', vagasControllers.show)
vagasRoutes.delete('/:id', vagasControllers.delete)

module.exports = vagasRoutes