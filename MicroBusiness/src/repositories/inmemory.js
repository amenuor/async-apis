'use strict'

const currentActiveSessions = []

const addActiveSession = (sessionId) => {
  currentActiveSessions.push(sessionId)
}

const getActiveSessions = () => {
  return currentActiveSessions
}

module.exports = {
  addActiveSession,
  getActiveSessions
}