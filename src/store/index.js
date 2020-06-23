import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth.module';
import user from './user.module';
import data from './data.module';
import calendar from './calendar.module';
import reservations from './reservations.module';

Vue.use(Vuex);

const modules = {
  auth,
  user,
  data,
  calendar,
  reservations,
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    pageTitle: null,
    sidebar: false,
    centered: false,
  },
  getters: {
    pageTitle: (state) => state.pageTitle || 'Home',
    sidebar: (state) => (state.sidebar != null ? state.sidebar : true),
    centered: (state) => (state.centered != null ? state.centered : false),
  },
  mutations: {
    pageTitle(state, title) {
      state.pageTitle = title;
    },
    sidebar(state, enabled) {
      state.sidebar = enabled;
    },
    centered(state, enabled) {
      state.centered = enabled;
    },
  },
  actions: {
    clearErrors({ commit }) {
      Object.keys(modules)
        .forEach((module) => commit(`${module}/clearErrors`));
    },
  },
  modules,
});
