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
        createExtChannel(messageParsed.exchangeName).then(() => {
          rabbitmq.ackInternal(message)
        })
        .catch(err => {
          console.error('Logon handling failed.')
          console.error(err)
        })
      } else {
        console.error('Received message for handling a logon but no exchange name was found in the message.')
        rabbitmq.ackInternal(message)
      }
      break
    case networkTopology.routingKeyLogoff:
      if (messageParsed.exchangeName){
        destroyExtChannel(messageParsed.exchangeName).then(() => {
          rabbitmq.ackInternal(message)
        }).catch(err => {
          console.error('Logoff handling failed.')
          console.error(err)
        })
      } else {
        console.error('Received message for handling logoff but no exchange name was found in the message.')
        rabbitmq.ackInternal(message)
      }
      break
    default:
      console.error('Received message with an unrecognized routing key.')
      rabbitmq.ackInternal(message)
    }
}

const createExtChannel = (exchangeName) => {
  return mongodb.getAllApis().then(apiDefinitions => {
    return rabbitmq.createExternalCommunicationChannel(exchangeName, externalClientService, apiDefinitions)
  })
  .catch(err => {
    console.error(err)
  })
}

const destroyExtChannel = (exchangeName) => {
  return rabbitmq.destroyExternalCommunicationChannel(exchangeName)
}

module.exports = securityService
