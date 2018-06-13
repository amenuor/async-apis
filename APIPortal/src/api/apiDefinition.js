import httpHandler from '@/utilities/httpHandler'

const getApiDefinitions = () => {
  return httpHandler.handler.get('/apis').then(response => {
    return httpHandler.handlePossibleAsyncResponse(response)
  })
}

const removeApiDefinition = (id) => {
  return httpHandler.handler.delete('/apis/' + id).then(response => {
    return httpHandler.handlePossibleAsyncResponse(response)
  })
}

const upsertApiDefinition = (id, apiDefinition) => {
  return httpHandler.handler.post('/apis/' + id, apiDefinition).then(response => {
    return httpHandler.handlePossibleAsyncResponse(response)
  })
}

export default {
  getApiDefinitions,
  upsertApiDefinition,
  removeApiDefinition
}
