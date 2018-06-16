import apidefAPIs from '@/api/apiDefinition'
import * as types from '../mutation-types'

// initial state
const state = {
  apidefs: {},
  error: null,
  success: null
}

// getters
const getters = {
  apidefs: state => state.apidefs,
  error: state => state.error,
  success: state => state.success
}

// actions
const actions = {
  fetchApiDefinitions ({ commit }) {
    apidefAPIs.getApiDefinitions(1).then(response => {
      if (response.status === 200) {
        commit(types.API_DEFS_FETCHED, response.data)
      } else {
        console.error(response)
        commit(types.API_FETCH_FAILED, 'Received ' + response.status + ' from backend.')
      }
    }).catch(err => {
      commit(types.API_FETCH_FAILED, err)
    })
  },
  storeApiDefinition ({ commit }, apiDefinition) {
    apidefAPIs.upsertApiDefinition(apiDefinition.apiId, apiDefinition).then(response => {
      if (response.status === 200) {
        commit(types.API_DEFS_STORED, response.data.apidefs)
      } else {
        console.error(response)
        commit(types.API_STORE_FAILED, 'Received ' + response.status + ' from backend.')
      }
    }).catch(err => {
      commit(types.API_STORE_FAILED, err)
    })
  }
}

// mutations
const mutations = {
  [types.API_DEFS_FETCHED] (state, apidefs) {
    state.apidefs = apidefs.reduce((state, currentDef) => {
      state[currentDef.apiId] = currentDef
      return state
    }, {})
    state.error = null
  },
  [types.API_FETCH_FAILED] (state, err) {
    state.error = 'Error while fetching apis. Please try again later.'
    console.error(err)
  },
  [types.API_DEFS_STORED] (state) {
    state.success = 'Updated API definition stored successfully'
    window.setTimeout(() => {
      state.success = null
    }, 5000)
  },
  [types.API_STORE_FAILED] (state, err) {
    state.error = 'Error while storing api. Please try again later.'
    console.error(err)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
