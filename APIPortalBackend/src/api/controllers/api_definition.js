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
  if (request.swagger.params.id.value){
    mongodb.storeApi(request.swagger.params.id.value, request.body)
    response.json({message: 'OK'})
    rabbit.publishToAPIDefinitionExchange({apiId, apiSchemaB64: Buffer.from(JSON.stringify(request.body).toString('base64'))}, constants.routingKeyUpsert)
  } else {
    response.status(400).end()
  }
}

const getList = (request, response) => {
  response.json(mongodb.getAllApis())
}

module.exports = {
  getList,
  upsert,
  remove
}