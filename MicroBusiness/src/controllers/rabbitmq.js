const amqp = require('amqplib')
const config = require('../configuration/config')
const Q = require('q')
const { networkTopology, serviceName } = require('../domain/constants')

let rabbitChannel = {}

const openConnectionHelper = (connectionString, assertChannelFunction, channelName) => {
  return amqp.connect(connectionString).then(connection => {
    return connection.createChannel()
  }).then( channel => {
    rabbitChannel[channelName] = channel
    if (assertChannelFunction) {
      return assertChannelFunction()
    } else {
      return true
    }
  }).catch(err => {
    console.error(err)
    return new Promise((resolve) => {
      setTimeout(() => { resolve(openConnectionHelper(connectionString, assertChannelFunction, channelName)) }, dbConfig.retryInterval)
    })
  })
}

const assertInternalChannelState = () => {
  return assertSecurityEventsChannel()
}

const assertSecurityEventsChannel = () => {
  return rabbitChannel['internal'].assertExchange(networkTopology.exchangeSecurityEvents, 'topic', {durable: false}).then(() => {
    return rabbitChannel['internal'].assertQueue(networkTopology.queueSecurityEvents, {durable: false}).then(result => {
      return Q.all([
        rabbitChannel['internal'].bindQueue(result.queue, networkTopology.exchangeSecurityEvents, networkTopology.routingKeyLogon),
        rabbitChannel['internal'].bindQueue(result.queue, networkTopology.exchangeSecurityEvents, networkTopology.routingKeyLogoff)
      ])
    })
  })
}

const publishToClient = (message, routingKey) => {
  console.log(routingKey)
  rabbitChannel['external'].publish('amq.topic', routingKey, Buffer.from(JSON.stringify(message)))
}

const setSecurityEventConsumer = (consumer) => {
  return rabbitChannel['internal'].consume(networkTopology.queueSecurityEvents, consumer)
}

const ackInternal = (message) => {
  rabbitChannel['internal'].ack(message)
} 

const openConnection = () => {
  return Q.all([
    openConnectionHelper(config.connectionStringInternal, assertInternalChannelState, 'internal'),
    openConnectionHelper(config.connectionStringExternal, null, 'external')
  ])
}

const closeConnection = () => {
  if (rabbitChannel['internal']) {
    rabbitChannel['internal'].close()
    rabbitChannel['internal'] = null
  }
  if (rabbitChannel['external']) {
    rabbitChannel['external'].close()
    rabbitChannel['external'] = null
  }
}

module.exports = {
  openConnection,
  setSecurityEventConsumer,
  ackInternal,
  publishToClient,
  closeConnection
}