const Routes = require('express');
const routes = Routes();

const userRoutes = require('./user.routes');
const vagasRoutes = require('./vagas.routes');
const tagsRoutes = require('./tags.routes');

routes.use('/users', userRoutes);
routes.use('/vagas', vagasRoutes);
routes.use('/tags', tagsRoutes);

module.exports = routes;
