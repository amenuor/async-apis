'use strict'

process.env.NODE_CONFIG_DIR = './src/config'

const mongodb = require('./repositories/mongodb')
const rabbitmq = require('./controllers/rabbitmq')
const SwaggerExpress = require('swagger-express-mw')
const app = require('express')()
const Q = require('q')
const port = process.env.PORT || 8080
const apiDefinitionService = require('./domain/services/apiDefinitionService')
const securityService = require('./domain/services/securityService')

const config = {
  appRoot: __dirname // required config
}

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err }

  // install middleware
  swaggerExpress.register(app)

  Q.all([mongodb.openConnection(), rabbitmq.openConnection()]).then(()=>{
    console.log('All wired. Ready to rock!')
    rabbitmq.setAPIDefinitionConsumer(apiDefinitionService)
    rabbitmq.setSecurityEventConsumer(securityService)
    app.listen(port)
  }).catch(err => {
    throw err
  })
})

module.exports = app // for testing