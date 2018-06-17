const Ajv = require('ajv')
const Q = require('q')
const mongodb = require('../../repositories/mongodb')
const rabbit = require('../../controllers/rabbitmq')
const constants = require('../../domain/constants').networkTopology
const ajv =  new Ajv({ loadSchema: (input) => { return Q.promise(function (resolve) { resolve(input) }) } })

const remove = (request, response) => {
  const apiId = request.swagger.params.id.value;
  if (apiId){
    mongodb.deleteApi(apiId)
    response.json({message: 'OK'})
    rabbit.publishToAPIDefinitionExchange({apiId}, constants.routingKeyRemove)
  } else {
    response.status(400).end()
  }
}

const isJsonString = (stringToValidate) => {
  try {
    JSON.parse(stringToValidate)
  } catch (e) {
    return false
  }
  return true
}

const upsert = (request, response) => {
  if (request.swagger.params.id.value && request.swagger.params.newApiDefBody){
    const requestBody = request.swagger.params.newApiDefBody.raw
    // Generic input validation
    if (!requestBody.apiId ||
      !requestBody.apidef ||
      !requestBody.apidef.metadata ||
      !requestBody.apidef.metadata.apiId ||
      !requestBody.apidef.metadata.apiName ||
      !requestBody.apidef.schemaB64) {
      response.status(400).end()
      return;
    }
    
    // Ensure the schema is actual a valid JSON schema
    const schema = Buffer.from(requestBody.apidef.schemaB64, 'base64').toString('utf8')
    if (!isJsonString(schema)) {
      response.status(400).end()
      return
    }
    ajv.compileAsync(JSON.parse(schema)).then(() => {
      // Everything is OK
      mongodb.storeApi(request.swagger.params.id.value, requestBody.apidef)
      rabbit.publishToAPIDefinitionExchange(requestBody, constants.routingKeyUpsert)
      response.json({message: 'OK'})  
    }).catch(err => {
      response.status(400).end()
    })

  } else {
    response.status(400).end()
  }
}

const getList = (request, response) => {
  mongodb.getAllApis().then(results => {
    response.json(results)    
  })
}

module.exports = {
  getList,
  upsert,
  remove
}