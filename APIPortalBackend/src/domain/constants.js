module.exports = {
  serviceName: 'APIGateway',
  networkTopology: {
    exchangeAsyncAPIDefinitions: 'AsyncApiDefinitions',
    queueAsyncAPIDefinitions: 'AsyncApiDefinitions_APIGateway',
    routingKeyUpsert: 'upsert',
    routingKeyRemove: 'remove'
  }
}