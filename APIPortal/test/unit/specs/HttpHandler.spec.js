import should from 'should'
import sinon from 'sinon'
import httpHandler from '@/utilities/httpHandler'

describe('HttpHandler', () => {
  it('should return the whole response for a 200 response', (done) => {
    const response = {
      status: 200,
      data: 'Success!'
    }
    httpHandler.handlePossibleAsyncResponse(response).then(receivedResponse => {
      should.exist(receivedResponse)
      should.exist(receivedResponse.data)
      should(receivedResponse.status).be.exactly(response.status)
      should(receivedResponse.data).be.exactly(response.data)
      done()
    }).catch(err => {
      should.not.exist(err)
      done()
    })
  })

  it('should return the whole response for a 500 response', (done) => {
    const response = {
      status: 500,
      data: 'Internal Server Error'
    }
    httpHandler.handlePossibleAsyncResponse(response).then(receivedResponse => {
      should.exist(receivedResponse)
      should.exist(receivedResponse.data)
      should(receivedResponse.status).be.exactly(response.status)
      should(receivedResponse.data).be.exactly(response.data)
      done()
    }).catch(err => {
      should.not.exist(err)
      done()
    })
  })

  it('fails if a 202 response does not contain a Location header', (done) => {
    const response = {
      status: 202,
      headers: {}
    }
    httpHandler.handlePossibleAsyncResponse(response).then(receivedResponse => {
      should.not.exist(receivedResponse)
      done()
    }).catch(err => {
      should.exist(err)
      done()
    })
  })

  after(function () {
    httpHandler.handler.get.restore()
  })

  it('succeed if a 202 response returns an actual location and that location returns a 200 response', (done) => {
    const response = {
      status: 202,
      headers: {
        location: 'hereAndThere'
      }
    }

    const finalResponse = {
      status: 200,
      data: 'This is real cool!'
    }

    sinon.stub(httpHandler.handler, 'get').callsFake(location => {
      should(location).be.exactly(response.headers.location)
      return {
        then (callback) {
          callback(finalResponse)
          return {
            catch (callbackErr) {
            }
          }
        }
      }
    })

    httpHandler.handlePossibleAsyncResponse(response).then(receivedResponse => {
      should.exist(receivedResponse)
      should.exist(receivedResponse.data)
      should(receivedResponse.status).be.exactly(finalResponse.status)
      should(receivedResponse.data).be.exactly(finalResponse.data)
      done()
    }).catch(err => {
      should.not.exist(err)
      done()
    })
  })
})
