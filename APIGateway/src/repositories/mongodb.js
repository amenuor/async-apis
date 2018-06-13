'use strict'

const config = require('config')
const dbConfig = config.get('apigateway.mongodb')
const MongoClient = require('mongodb').MongoClient
const Q = require('q')

const apiCollectionName = 'ApiCollection'
const apigatewayDatabaseName = 'apiGateway'

let currentDBConnection = null
let apiCollection = null

const openConnection = () => {
  // connect to MongoDB
  // Use connect method to connect to the server
  const d = Q.defer()
  MongoClient.connect(dbConfig.connectionString, function(err, client) {
    if (!err) {
      currentDBConnection = client.db(apigatewayDatabaseName)
      apiCollection = currentDBConnection.collection(apiCollectionName)
      console.log('Connected to MongoDB at ' + dbConfig.connectionString)
      d.resolve()
    } else {
      console.error('Failed connection to MongoDB at ' + dbConfig.connectionString)
      console.error(err)
      d.reject(err)
    }
  })
  return d.promise
}

const tryGetApi = function(apiId) {
  if (!currentDBConnection) {
    throw new Error('Illegal state. Open a connection to the database by invoking openConnection before invoking tryGetApi.')
  }

  // Get the documents collection
  const d = Q.defer()

  // Find some documents
  apiCollection.find({key: apiId}).toArray(function(err, docs) {
    if (err) {
      d.reject(err)
    } else {
      d.resolve(docs)
    }
  })

  return d.promise
}

const getAllApis = () => {
  if (!currentDBConnection) {
    throw new Error('Illegal state. Open a connection to the database by invoking openConnection before invoking deleteApi.')
  }
  const d = Q.defer()

  apiCollection.find({}).toArray(function (err, docs) {
    if (err) {
      d.reject(err)
    } else {
      d.resolve(docs)
    }
  })

  return d.promise
}

const deleteApi = (apiId) => {
  if (!currentDBConnection) {
    throw new Error('Illegal state. Open a connection to the database by invoking openConnection before invoking deleteApi.')
  }
  const d = Q.defer()

  apiCollection.deleteOne({key: apiId}, function (err, docs) {
    if (err) {
      d.reject(err)
    } else {
      d.resolve(docs)
    }
  })

  return d.promise
}

const storeApi = (apiId, apiDef) => {
  const d = Q.defer()
  apiCollection.insert({apiId, apiDef, createdAt: new Date()}, function(err, result){
    if (err) {
      console.error('Failed connection to MongoDB at ' + dbConfig.connectionString)
      console.error(err)
      d.reject(err)
    } else {
      d.resolve(result.result)
    }
  })
  return d.promise
}

const closeConnection = () => {
  if (currentDBConnection) {
    currentDBConnection.close()
    currentDBConnection = null
    apiCollection = null
  }
}

module.exports = {
  openConnection,
  tryGetApi,
  getAllApis,
  storeApi,
  deleteApi,
  closeConnection
}