const keepAlive = (request, response) => {
  response.json({message: 'OK'})
}

module.exports = {
  keepAlive
}