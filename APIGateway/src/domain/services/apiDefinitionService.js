const networkTopology = require('../../domain/constants').networkTopology
const mongodb = require('../../repositories/mongodb')

const apiDefinitionService = (message) => {
  console.log('Received message on ' + message.fields.routingKey)
  const messageParsed = JSON.parse(message.content.toString('utf8'))

  switch (message.fields.routingKey) {
    case networkTopology.routingKeyRemove:
      if (messageParsed.apiId){
        removeApiDefinitionById(messageParsed.apiId).catch(err => {
          console.error('Removal of API failed.')
          console.error(err)
        })
      } else {
        console.error('Received message for removing API Deifnition but no ID was found in the message.')
      }
      break
    case networkTopology.routingKeyUpsert:
      if (messageParsed.apiId && messageParsed.apiSchemaB64){
        addApiDefinition(messageParsed.apiId, messageParsed).catch(err => {
          console.error('Adding of API failed.')
          console.error(err)
        })
      } else {
        console.error('Received message for adding API Deifnition but no ID or no schema was found in the message.')
      }
      break
    default:
      console.error('Received message with an unrecognized routing key.')
  }
}

const removeApiDefinitionById = (apiId) => {
  return mongodb.deleteApi(apiId)
}

const addApiDefinition = (apiId, apiDefinition) => {
  return mongodb.storeApi(apiId, apiDefinition)
}

module.exports = apiDefinitionService