const amqp = require('amqplib')
const config = require('config')
const dbConfig = config.get('apigateway.rabbitmq')
const Q = require('q')
const { networkTopology, serviceName } = require('../domain/constants')

let rabbitChannel = {}

const openConnectionHelper = (connectionString, assertChannelFunction, channelName) => {
  return amqp.connect(connectionString).then(connection => {
    return connection.createChannel()
  }).then( channel => {
    rabbitChannel[channelName] = channel
    return assertChannelFunction()
  }).catch(err => {
    console.error(err)
    return new Promise((resolve) => {
      setTimeout(() => { resolve(openConnectionHelper(connectionString, assertChannelFunction, channelName)) }, dbConfig.retryInterval)
    })
  })
}

const assertInternalChannelState = () => {
  return Q.all([
    assertAPIDefinitionCommunicationChannel(),
    assertSecurityEventsChannel()
  ])
}

const assertAPIDefinitionCommunicationChannel = () => {
  return rabbitChannel['internal'].assertExchange(networkTopology.exchangeAsyncAPIDefinitions, 'topic', {durable: true}).then(() => {
    return rabbitChannel['internal'].assertQueue(networkTopology.queueAsyncAPIDefinitions, {durable: true}).then(result => {
      return Q.all([
        rabbitChannel['internal'].bindQueue(result.queue, networkTopology.exchangeAsyncAPIDefinitions, networkTopology.routingKeyUpsert),
        rabbitChannel['internal'].bindQueue(result.queue, networkTopology.exchangeAsyncAPIDefinitions, networkTopology.routingKeyRemove)
      ])
    })
  })
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

const publishNewLogonEvent = (message) => {
  // This is used exclusively for the PoC purpose. We are mocking the security backend.
  rabbitChannel['internal'].publish(networkTopology.exchangeSecurityEvents, networkTopology.routingKeyLogon, Buffer.from(JSON.stringify(message)))
}

const publishNewLogoffEvent = (message) => {
  // This is used exclusively for the PoC purpose. We are mocking the security backend.
  rabbitChannel['internal'].publish(networkTopology.exchangeSecurityEvents, networkTopology.routingKeyLogoff, Buffer.from(JSON.stringify(message)))
}


const assertExternalChannelState = () => {
  // Nothing needed for now it seems...
}

const createExternalCommunicationChannel = (exchangeName, consumer, apiDefinitions) => {
  return rabbitChannel['external'].assertExchange(exchangeName, 'topic', {durable: false, autoDelete: true}).then(() => {
    return rabbitChannel['external'].assertQueue(exchangeName + '_' + serviceName, {durable: false, autoDelete: true}).then(result => {
      var promises = []
      apiDefinitions.forEach(apiDefinition => {
        promises.push(rabbitChannel['external'].bindQueue(result.queue, exchangeName, apiDefinition.apiId))
        promises.push(rabbitChannel['external'].assertExchange(apiDefinition.downstreamExchange, 'topic', {durable: true}))
      })
      promises.push(rabbitChannel['external'].consume(result.queue, consumer))
      return Q.all(promises)
    })
  })
}

const destroyExternalCommunicationChannel = (exchangeName) => {
  return rabbitChannel['external'].deleteQueue(exchangeName + '_' + serviceName).then(() => {
    return rabbitChannel['external'].deleteExchange(exchangeName)
  })
}

const publishToExternalExchange = (message, exchangeName, routingKey) => {
  rabbitChannel['external'].publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)))
}

const setAPIDefinitionConsumer = (consumer) => {
  return rabbitChannel['internal'].consume(networkTopology.queueAsyncAPIDefinitions, consumer)
}

const setSecurityEventConsumer = (consumer) => {
  return rabbitChannel['internal'].consume(networkTopology.queueSecurityEvents, consumer)
}

const ackInternal = (message) => {
  rabbitChannel['internal'].ack(message)
} 

const ackExternal = (message) => {
  rabbitChannel['external'].ack(message)
}

const openConnection = () => {
  return Q.all([
    openConnectionHelper(dbConfig.connectionStringInternal, assertInternalChannelState, 'internal'),
    openConnectionHelper(dbConfig.connectionStringExternal, assertExternalChannelState, 'external')
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
  setAPIDefinitionConsumer,
  setSecurityEventConsumer,
  ackInternal,
  ackExternal,
  createExternalCommunicationChannel,
  destroyExternalCommunicationChannel,
  publishToExternalExchange,
  closeConnection,
  publishNewLogonEvent,
  publishNewLogoffEvent
}