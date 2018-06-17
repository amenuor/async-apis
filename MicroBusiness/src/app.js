'use strict'

const rabbitmq = require('./controllers/rabbitmq')
const securityService = require('./domain/services/securityService')
const businessService = require('./domain/services/businessService')

rabbitmq.openConnection().then(() => {
  console.log('All wired. Ready to rock!')
  rabbitmq.setSecurityEventConsumer(securityService)
  businessService()
})
.catch(err => {
  throw err
})