const Ajv = require('ajv')
const ajv = new Ajv({ loadSchema: (input) => { return Q.promise(function (resolve) { resolve(input) }) } })
const networkTopology = require('../../domain/constants').networkTopology
const mongodb = require('../../repositories/mongodb')
const rabbit = require('../../controllers/rabbitmq')
const currentSchemas = {}

const apiDefinitionService = (message) => {
  console.log('Received message on ' + message.fields.routingKey)
  const messageParsed = JSON.parse(message.content.toString('utf8'))

  switch (message.fields.routingKey) {
    case networkTopology.routingKeyRemove:
      removeApiDefinition(message, messageParsed)
      break
    case networkTopology.routingKeyUpsert:
      upsertAPIDefinition(message, messageParsed)
      break
    default:
      console.error('Received message with an unrecognized routing key.')
      rabbit.ackInternal(message)
    }
    updateIfRequired()
}

const updateIfRequired = () => {
  mongodb.getAllApis().then(apis => {
    apis.forEach(api => {
      const schema = Buffer.from(api.apiDef.schemaB64, 'base64').toString('utf8')
      ajv.compileAsync(JSON.parse(schema)).then((validation) => {
        currentSchemas[api.apiId] = validation
      }).catch(err => {
        console.error('Schema parsing failed. ')
        console.error(err)
      })
  
    });
  })
}

const getCurrentSchemas = () => {
  return currentSchemas
}

const upsertAPIDefinition = (message, messageParsed) => {
  if (messageParsed.apiId && messageParsed.apidef.schemaB64 && messageParsed.apidef.metadata.downstreamExchange){
    addApiDefinition(messageParsed.apiId, messageParsed.apidef).then(() => {
      rabbit.ackInternal(message)
    })
    .catch(err => {
      console.error('Adding of API failed.')
      console.error(err)
      rabbit.ackInternal(message)
    })
  } else {
    console.error('Received message for adding API Definition but no ID, no downstreamExchange, or no schema was found in the message.')
    rabbit.ackInternal(message)
  }
}

const removeApiDefinition = (message, messageParsed) => {
  if (messageParsed.apiId){
    mongodb.deleteApi(messageParsed.apiId).then(() => {
      rabbit.ackInternal(message)
    })
    .catch(err => {
      console.error('Removal of API failed.')
      console.error(err)
      rabbit.ackInternal(message)
    })
  } else {
    console.error('Received message for removing API Definition but no ID was found in the message.')
    rabbit.ackInternal(message)
  }
}

const addApiDefinition = (apiId, apiDefinition) => {
  return mongodb.storeApi(apiId, apiDefinition)
}

module.exports = {
  getCurrentSchemas,
  apiDefinitionService
}