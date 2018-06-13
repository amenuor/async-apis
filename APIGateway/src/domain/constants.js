module.exports = {
  serviceName: 'APIGateway',
  networkTopology: {
    exchangeAsyncAPIDefinitions: 'AsyncApiDefinitions',
    queueAsyncAPIDefinitions: 'AsyncApiDefinitions_APIGateway',
    routingKeyUpsert: 'upsert',
    routingKeyRemove: 'remove',

    exchangeSecurityEvents: 'SecurityEvents',
    queueSecurityEvents: 'SecurityEvents_APIGateway',
    routingKeyLogon: 'logon',
    routingKeyLogoff: 'logoff',

    exchangeExternalClient: 'ExternalClient_'
  }
}