const { getCurrentSchemas  } = require('./apiDefinitionService')
const rabbit = require ('../../controllers/rabbitmq') 

const externalClientService = (message) => {
  const currentSchemas = getCurrentSchemas()
  const messageParsed = JSON.parse(message.content.toString('utf8'))

  console.log('Recived new message from external client ' + message.fields.routingKey)
  console.log(messageParsed)
  
  if (!messageParsed.apiId) {
    console.error('Malformed message')
    rabbit.ackExternal(message)
    return
  }

  const validateFunction = currentSchemas[messageParsed.apiId]
  if (!validateFunction || {}.toString.call(validateFunction) !== '[object Function]'){
    console.error('Schema not found for Api with id ' + messageParsed.apiId)
    rabbit.ackExternal(message)
    return
  }

  if (validateFunction(messageParsed)){
    console.log('SUCCESS: Validation passed')
  } else {
    console.log('FAILED: Validation failed')
  }

  rabbit.ackExternal(message)

}

module.exports = externalClientService
