module.exports = {
  connectionStringInternal: process.env.RABBIT_CONN_STR_INT || 'amqp://rabbitmq_int', 
  connectionStringExternal: process.env.RABBIT_CONN_STR_EXT || 'amqp://rabbitmq_ext'
}