const networkTopology = require('../../domain/constants').networkTopology
const rabbitmq = require('../../controllers/rabbitmq')
const mongodb = require('../../repositories/mongodb')
const externalClientService = require('./externalClientService')

const securityService = (message) => {
  console.log('Received message on ' + message.fields.routingKey)
  const messageParsed = JSON.parse(message.content.toString('utf8'))

  switch (message.fields.routingKey) {
    case networkTopology.routingKeyLogon:
      if (messageParsed.exchangeName){
        createExtChannel(messageParsed.exchangeName).catch(err => {
          console.error('Logon handling failed.')
          console.error(err)
        })
      } else {
        console.error('Received message for handling a logon but no exchange name was found in the message.')
      }
      break
    case networkTopology.routingKeyLogoff:
      if (messageParsed.exchangeName){
        destroyExtChannel(messageParsed.exchangeName).catch(err => {
          console.error('Logoff handling failed.')
          console.error(err)
        })
      } else {
        console.error('Received message for handlign logoff but no exchange name was found in the message.')
      }
      break
    default:
      console.error('Received message with an unrecognized routing key.')
  }
}

const createExtChannel = (exchangeName) => {
  var apiDefinitions = mongodb.getAllApis()
  return rabbitmq.createExternalCommunicationChannel(exchangeName, externalClientService, apiDefinitions)
}

const destroyExtChannel = (apiId, apiSchemaB64) => {
  return rabbitmq.destroyExternalCommunicationChannel(exchangeName)
}

module.exports = securityService
