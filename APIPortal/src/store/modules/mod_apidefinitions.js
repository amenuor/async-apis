import apidefAPIs from '@/api/apiDefinition'
import * as types from '../mutation-types'

// initial state
const state = {
  apidefs: {}
}

// getters
const getters = {
  apidefs: state => state.apidefs
}

// actions
const actions = {
  fetchApiDefinitions ({ commit }) {
    apidefAPIs.getApiDefinitions(1).then(response => {
      if (response.status === 200) {
        commit(types.API_DEFS_FETCHED, response.data.apidefs)
      } else {
        console.error('Received ' + response.status + ' from backend. Response object:')
        console.error(response)
      }
    }).catch(err => {
      console.error(err)
    })
  }
}

// mutations
const mutations = {
  [types.API_DEFS_FETCHED] (state, apidefs) {
    state.apidefs = apidefs
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
