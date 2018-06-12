const amqp = require('amqplib')
const config = require('config')
const dbConfig = config.get('apigateway.rabbitmq')
const Q = require('q')
const { networkTopology, serviceName } = require('../domain/constants')

let rabbitChannelInternal = null
let rabbitChannelExternal = null

const openConnectionHelper = (connectionString, assertChannelFunction) => {
  return amqp.connect(connectionString).then(connection => {
    return connection.createChannel()
  }).then( channel => {
    rabbitChannelInternal = channel
    return assertChannelFunction()
  }).catch(err => {
    console.error(err)
    return new Promise((resolve) => {
      setTimeout(() => { resolve(openConnectionHelper(connectionString, assertChannelFunction)) }, dbConfig.retryInterval)
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
  return rabbitChannelInternal.assertExchange(networkTopology.exchangeAsyncAPIDefinitions, 'topic', {durable: true}).then(() => {
    return rabbitChannelInternal.assertQueue(networkTopology.queueAsyncAPIDefinitions, {durable: true}).then(result => {
      return Q.all([
        rabbitChannelInternal.bindQueue(result.queue, networkTopology.exchangeAsyncAPIDefinitions, networkTopology.routingKeyUpsert),
        rabbitChannelInternal.bindQueue(result.queue, networkTopology.exchangeAsyncAPIDefinitions, networkTopology.routingKeyRemove)
      ])
    })
  })
}

const assertSecurityEventsChannel = () => {
  return rabbitChannelInternal.assertExchange(networkTopology.exchangeSecurityEvents, 'topic', {durable: false}).then(() => {
    return rabbitChannelInternal.assertQueue(networkTopology.queueSecurityEvents, {durable: false}).then(result => {
      return Q.all([
        rabbitChannelInternal.bindQueue(result.queue, networkTopology.exchangeSecurityEvents, networkTopology.routingKeyLogon),
        rabbitChannelInternal.bindQueue(result.queue, networkTopology.exchangeSecurityEvents, networkTopology.routingKeyLogoff)
      ])
    })
  })
}

const assertExternalChannelState = () => {
  // Nothing needed for now it seems...
}

const createExternalCommunicationChannel = (exchangeName, consumer, apiDefinitions) => {
  return rabbitChannelExternal.assertExchange(exchangeName, 'topic', {durable: false, autoDelete: true}).then(() => {
    return rabbitChannelExternal.assertQueue(exchangeName + '_' + serviceName, {durable: false, autoDelete: true}).then(result => {
      var promises = []
      apiDefinitions.forEach(apiDefinition => {
        promises.push(rabbitChannelExternal.bindQueue(result.queue, exchangeName, apiDefinition.apiId))
        promises.push(rabbitChannelExternal.assertExchange(apiDefinition.downstreamExchange, 'topic', {durable: true}))
      })
      promises.push(rabbitChannelExternal.consume(result.queue, consumer))
      return Q.all(promises)
    })
  })
}

const destroyExternalCommunicationChannel = (exchangeName) => {
  return rabbitChannelExternal.deleteQueue(exchangeName + '_' + serviceName).then(() => {
    return rabbitChannelExternal.deleteExchange(exchangeName)
  })
}

const publishToExternalExchange = (message, exchangeName, routingKey) => {
  rabbitChannelExternal.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)))
}

const setAPIDefinitionConsumer = (consumer) => {
  return rabbitChannelInternal.consume(networkTopology.queueAsyncAPIDefinitions, consumer)
}

const setSecurityEventConsumer = (consumer) => {
  return rabbitChannelInternal.consume(networkTopology.queueSecurityEvents, consumer)
}

const ackInternal = (message) => {
  rabbitChannelExternal.ack(message)
} 

const ackExternal = (message) => {
  rabbitChannelExternal.ack(message)
}

const openConnection = () => {
  return Q.all([
    openConnectionHelper(dbConfig.connectionStringInternal, assertInternalChannelState),
    openConnectionHelper(dbConfig.connectionStringExternal, assertExternalChannelState)
  ])
}

const closeConnection = () => {
  if (rabbitChannelInternal) {
    rabbitChannelInternal.close()
    rabbitChannelInternal = null
  }
  if (rabbitChannelExternal) {
    rabbitChannelExternal.close()
    rabbitChannelExternal = null
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
  closeConnection
}