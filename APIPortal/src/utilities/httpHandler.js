import axios from 'axios'
import Q from 'q'

const standardTimeoutMS = 100
const httpHandler = axios.create({
  baseURL: 'http://apiportalbackend:7070',
  timeout: standardTimeoutMS,
  headers: {'Authorization': 'NotInUseYet'}
})

const handlePossibleAsyncResponse = (response, deferred) => {
  const d = deferred || Q.defer()
  if (response.status === 202) {
    const location = response.headers['location']
    if (location) {
      setTimeout(() => {
        httpHandler.get(location).then(response => {
          handlePossibleAsyncResponse(response, d)
        }).catch(err => {
          d.reject(err)
        })
      }, standardTimeoutMS)
    } else {
      console.error('Could not complete async request. Missing Location header from 202 response:')
      console.error(response)
      d.reject(new Error('Missing Location header for 202 response'))
    }
  } else {
    d.resolve(response)
  }
  return d.promise
}

export default {
  handlePossibleAsyncResponse,
  handler: httpHandler
}
