import Vue from 'vue'
import Vuex from 'vuex'
import modAPIDefs from './modules/mod_apidefinitions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    modAPIDefs
  }
})
