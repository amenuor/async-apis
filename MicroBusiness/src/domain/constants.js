module.exports = {
  serviceName: 'MicroBusiness',
  networkTopology: {
    exchangeSecurityEvents: 'SecurityEvents',
    queueSecurityEvents: 'SecurityEvents_MicroBusiness',
    routingKeyLogon: 'logon',
    routingKeyLogoff: 'logoff'
  }
}