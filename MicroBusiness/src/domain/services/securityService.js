const networkTopology = require('../../domain/constants').networkTopology
const inmemory = require('../../repositories/inmemory')
const rabbit = require ('../../controllers/rabbitmq')

const securityService = (message) => {
  console.log('Received message on ' + message.fields.routingKey)
  const messageParsed = JSON.parse(message.content.toString('utf8'))

  switch (message.fields.routingKey) {
    case networkTopology.routingKeyLogon:
      if (messageParsed.exchangeName){
        inmemory.addActiveSession(messageParsed.exchangeName)
        rabbit.ackInternal(message)
      } else {
        console.error('Received message for handling a logon but no exchange name was found in the message.')
      }
      break
    case networkTopology.routingKeyLogoff:
      console.error('Not supported yet.')
      break
    default:
      console.error('Received message with an unrecognized routing key.')
  }
}

module.exports = securityService
