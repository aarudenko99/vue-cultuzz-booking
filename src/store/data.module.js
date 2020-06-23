/* eslint-disable no-shadow */

import ApiService from '@/services/api.service';
import shared from '@/shared';

const state = {
  countries: null,
};

const getters = {
  countries: (state) => state.countries,
};

const mutations = {
  clearErrors() {
    // do nothing
  },
  countries(state, countries) {
    state.countries = countries;
  },
};

const actions = {
  async fetchCountries({ commit, getters }) {
    if (getters.countries != null) return;

    try {
      const response = await ApiService.get(`${shared.apiEndpoint}/data/countries`);
      commit('countries', response.data);
    } catch (error) {
      // do nothing
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
