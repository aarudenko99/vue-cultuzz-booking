/* eslint-disable no-shadow */

import StorageService from '@/services/storage.service';

// import router from '@/router';
import { initialRoute, router } from '@/router';
import UserService from '@/services/user.service';
import { AuthError, TooManyAttemptsError, ValidationError } from '@/errors';

const state = {
  user: StorageService.getUser(),
  emailResent: false,
  validationError: null,
  rateLimitError: null,
  pending: false,
  sessionExpired: false,
};

const getters = {
  loggedIn: (state) => state.user != null,
  user: (state) => state.user,
  sessionExpired: (state) => state.sessionExpired,
  emailResent: (state) => state.emailResent,
  emailVerified: (state, getters) => getters.loggedIn && state.user.email_verified,
  pdFilled: (state, getters) => getters.loggedIn && state.user.pd_filled,
  cdFilled: (state, getters) => getters.loggedIn && state.user.cd_filled,
  requiredFilled: (state, getters) => getters.pdFilled && getters.cdFilled,
  hasProfile: (state, getters) => getters.loggedIn && state.user.profile != null,
  hotelRegistered: (state, getters) => getters.hasProfile && state.user.profile.hotel_id != null,
  hotelName: (state) => state.user.profile.hotel_name,
  hotelID: (state) => state.user.profile.hotel_id,
  pending: (state) => state.pending,
  validationError: (state) => state.validationError,
  rateLimitError: (state) => state.rateLimitError,
};

const mutations = {
  clearErrors(state) {
    state.validationError = null;
    state.rateLimitError = null;
  },
  user(state, user) {
    // TODO: set/update user in storage?
    state.user = user;
    state.sessionExpired = false;
  },
  sessionExpired(state) {
    if (state.user != null) {
      state.sessionExpired = true;
    }
  },
  emailResent(state, ok) {
    state.emailResent = !!ok;
  },
  beforeRequest(state) {
    state.validationError = null;
    state.rateLimitError = null;
    state.pending = true;
  },
  requestComplete(state) {
    state.pending = false;
  },
  validationError(state, error) {
    state.validationError = error;
    state.pending = false;
  },
  rateLimitError(state, error) {
    state.pending = false;
    state.rateLimitError = error;
  },
  // emailVerified(state) {
  //   state.user.email_verified = true;
  // },
  // pdFilled(state) {
  //   state.user.pd_filled = true;
  // },
  // cdFilled(state) {
  //   state.user.cd_filled = true;
  // },
};

function handleError(commit, error) {
  if (error instanceof AuthError) {
    commit('loginAuthError', {
      code: error.errorCode,
      message: error.message,
    });
  }
  if (error instanceof ValidationError) {
    commit('validationError', error);
  }
  if (error instanceof TooManyAttemptsError) {
    commit('rateLimitError', error);
  }
}

const actions = {
  async getUser({ state, commit }, redirect = true) {
    const wasLoggedIn = state.user != null;
    try {
      const user = await UserService.getUser();
      commit('user', user);
      if (!wasLoggedIn && redirect) {
        router.push(router.history.current.query.redirect || '/');
      }
    } catch (e) {
      if (wasLoggedIn) {
        commit('user', null);
        if (redirect) {
          router.push({ name: 'login' });
        }
      }
    }
  },
  async resendEmail({ commit }) {
    commit('beforeRequest');
    try {
      const ok = await UserService.resendEmail();
      commit('emailResent', ok);
      commit('requestComplete');
    } catch (e) {
      commit('emailResent', false);
      handleError(commit, e);
    }
  },
  async verifyEmail({ commit }, { id, hash, query }) {
    commit('beforeRequest');
    try {
      const user = await UserService.verifyEmail(id, hash, query);
      commit('requestComplete');
      if (user != null) {
        commit('user', user);
        router.push({ name: initialRoute });
      }
    } catch (e) {
      handleError(commit, e);
    }
  },
  async updateProfile({ commit, getters }, data) {
    commit('beforeRequest');
    const needRedirect = !getters.requiredFilled;
    try {
      const user = await UserService.updateProfile(data);
      commit('user', user);
      commit('requestComplete');
      if (needRedirect && getters.requiredFilled) {
        router.push({ name: initialRoute });
      }
    } catch (e) {
      handleError(commit, e);
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
