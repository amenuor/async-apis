module.exports = {
  serviceName: 'APIGateway',
  networkTopology: {
    exchangeAsyncAPIDefinitions: 'AsyncApiDefinitions',
    queueAsyncAPIDefinitions: exchangeAsyncAPIDefinitions + '_' + serviceName,
    routingKeyUpsert = 'upsert',
    routingKeyRemove = 'remove',

    exchangeSecurityEvents: 'SecurityEvents',
    queueSecurityEvents: exchangeSecurityEvents + '_' + serviceName,
    routingKeyLogon = 'logon',
    routingKeyLogoff = 'logoff',

    exchangeExternalClient: 'ExternalClient_'
  }
}