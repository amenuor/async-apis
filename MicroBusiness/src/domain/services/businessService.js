const inmemory = require('../../repositories/inmemory')
const rabbit = require('../../controllers/rabbitmq')

const startService = () => {
  setInterval(() => {
    const businessData = Math.random() * Math.floor(2000)
    const clients = inmemory.getActiveSessions()
    console.log('New business data: ' + businessData + '. An event will be sent to ' + clients.length + ' clients.')    

    if (clients.length > 0) {
      clients.forEach(routingKey => {
        console.log(routingKey)
        rabbit.publishToClient({businessData}, routingKey)
      })
    }
  }, 5000)
}

module.exports = startService
