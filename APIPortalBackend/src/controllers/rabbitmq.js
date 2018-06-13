const amqp = require('amqplib')
const config = require('config')
const dbConfig = config.get('apigateway.rabbitmq')
const Q = require('q')
const { networkTopology } = require('../domain/constants')

let rabbitChannel = null

const openConnectionHelper = (connectionString, assertChannelFunction) => {
  return amqp.connect(connectionString).then(connection => {
    return connection.createChannel()
  }).then( channel => {
    rabbitChannel = channel
    return assertChannelFunction()
  }).catch(err => {
    console.error(err)
    return new Promise((resolve) => {
      setTimeout(() => { resolve(openConnectionHelper(connectionString, assertChannelFunction)) }, dbConfig.retryInterval)
    })
  })
}

const assertChannelState = () => {
  return assertAPIDefinitionCommunicationChannel
}

const assertAPIDefinitionCommunicationChannel = () => {
  return rabbitChannelInternal.assertExchange(networkTopology.exchangeAsyncAPIDefinitions, 'topic', {durable: true})
}

const publishToAPIDefinitionExchange = (message, routingKey) => {
  rabbitChannel.publish(networkTopology.exchangeAsyncAPIDefinitions, routingKey, Buffer.from(JSON.stringify(message)))
}

const ack = (message) => {
  rabbitChannel.ack(message)
}

const openConnection = () => {
  return openConnectionHelper(dbConfig.connectionString, assertChannelState)
}

const closeConnection = () => {
  if (rabbitChannel) {
    rabbitChannel.close()
    rabbitChannel = null
  }
}

module.exports = {
  openConnection,
  ack,
  publishToAPIDefinitionExchange,
  closeConnection
}