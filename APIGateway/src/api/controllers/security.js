const uuidv4 = require('uuid/v4')
const rabbit = require('../../controllers/rabbitmq')

const logon = (request, response) => {
  // Mock security backend and emit logon successful event
  const userId = request.swagger.params.logonBody.raw.userId;
  const password = request.swagger.params.logonBody.raw.password;

  if (!userId || !password) {
    console.error('userId or password not present')
    console.error(request.swagger.params)
    response.status(400).end()
    return
  }

  exchangeName = uuidv4()
  rabbit.publishNewLogonEvent({exchangeName})

  response.json({sessionId: exchangeName})
}

const logoff = (request, response) => {
  // Mock security backend and emit logon successful event
  const exchangeName = request.swagger.params.logoffBody.sessionId;
  rabbit.publishNewLogoffEvent({exchangeName})
  response.json({status: 'OK'})
}

module.exports = {
  logon,
  logoff
}