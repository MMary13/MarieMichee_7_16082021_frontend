import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('user-token') || '',
    status: '',
    user: {}
  },
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, token){
      state.status = 'success'
      state.token = token
    },
    auth_error(state){
      state.status = 'error'
    },
    logout_request(state){
      state.status = ''
      state.token = ''
      state.user = {}
    }
  },
  getters: {
    isAuthenticated: state => {
      // !!state.token
      if(state.token == ''){
        return false;
      } else {
        return true;
      }
    },
    authStatus: state => state.status,
  },
  actions: {
    logout(context) {
      context.commit('logout_request');
    }
  },
  modules: {
  }
})
