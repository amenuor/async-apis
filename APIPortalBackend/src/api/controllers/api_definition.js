const mongodb = require('../../repositories/mongodb')
const rabbit = require('../../controllers/rabbitmq')
const constants = require('../../domain/constants').networkTopology

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

const upsert = (request, response) => {
  if (request.swagger.params.id.value && request.swagger.params.newApiDefBody){
    const requestBody = request.swagger.params.newApiDefBody.raw
    console.log(requestBody)
    if (!requestBody.apiId ||
      !requestBody.apidef ||
      !requestBody.apidef.metadata ||
      !requestBody.apidef.metadata.apiId ||
      !requestBody.apidef.metadata.apiName ||
      !requestBody.apidef.schemaB64) {
      response.status(400).end()
      return;
    }

    mongodb.storeApi(request.swagger.params.id.value, requestBody.apidef)

    rabbit.publishToAPIDefinitionExchange(requestBody, constants.routingKeyUpsert)
    response.json({message: 'OK'})
  } else {
    response.status(400).end()
  }
}

const getList = (request, response) => {
  mongodb.getAllApis().then(results => {
    console.log(results)
    response.json(results)    
  })
}

module.exports = {
  getList,
  upsert,
  remove
}