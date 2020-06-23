/* eslint-disable no-shadow */

import { router } from '@/router';
import UserService from '@/services/user.service';
import { ValidationError, AuthError, TooManyAttemptsError } from '@/errors';

const state = {
  authenticating: false,
  authErrorCode: 0,
  authError: '',
  validationError: null,
  rateLimitError: null,
  resetPasswordSent: false,
};

const getters = {
  authenticating: (state) => state.authenticating,
  authErrorCode: (state) => state.authErrorCode,
  authError: (state) => state.authError,
  validationError: (state) => state.validationError,
  rateLimitError: (state) => state.rateLimitError,
  resetPasswordSent: (state) => state.resetPasswordSent,
};

const mutations = {
  clearErrors(state) {
    state.authError = '';
    state.authErrorCode = 0;
    state.validationError = null;
    state.rateLimitError = null;
  },
  loginRequest(state) {
    state.authenticating = true;
    state.authError = '';
    state.authErrorCode = 0;
    state.validationError = null;
    state.rateLimitError = null;
  },
  loginSuccess(state) {
    state.authenticating = false;
  },
  loginAuthError(state, { code, message }) {
    state.authenticating = false;
    state.authError = message;
    state.authErrorCode = code;
  },
  validationError(state, error) {
    state.authenticating = false;
    state.validationError = error;
  },
  rateLimitError(state, error) {
    state.authenticating = false;
    state.rateLimitError = error;
  },
  sendPasswordReset(state) {
    state.authenticating = true;
    state.resetPasswordSent = false;
    state.rateLimitError = null;
  },
  resetPasswordSent(state) {
    state.authenticating = false;
    state.resetPasswordSent = true;
  },
  resetPasswordRequest(state) {
    state.authenticating = true;
    state.validationError = null;
    state.rateLimitError = null;
  },
  resetPasswordComplete(state) {
    state.authenticating = false;
  },
  registerRequest(state) {
    state.authenticating = true;
    state.validationError = null;
    state.rateLimitError = null;
  },
  registerSuccess(state) {
    state.authenticating = false;
  },
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

  async cookie() {
    await UserService.getCookie();
  },

  async login({ commit, rootGetters }, { email, password }) {
    commit('loginRequest');
    commit('user/user', null, { root: true });

    try {
      const user = await UserService.login(email, password);
      commit('loginSuccess', user);
      commit('user/user', user, { root: true });

      let redirectTo = router.history.current.query.redirect || '/';
      if (!rootGetters['user/requiredFilled']) {
        redirectTo = { name: 'details' };
      }
      router.push(redirectTo);
    } catch (e) {
      handleError(commit, e);
    }
  },

  async logout({ commit }, { forced = false, stay = false }) {
    const toLogin = { name: 'login' };
    if (stay) {
      const redirect = router.currentRoute.fullPath;
      if (redirect !== '/') {
        toLogin.query = { redirect };
      }
    }
    await UserService.logout(forced);
    commit('user/user', null, { root: true });
    router.push(toLogin);
  },

  async sendResetPasswordEmail({ commit }, { email }) {
    try {
      commit('sendPasswordReset');
      await UserService.sendResetPasswordEmail(email);
      commit('resetPasswordSent');
    } catch (e) {
      handleError(commit, e);
    }
  },

  async resetPassword({ commit, dispatch }, { email, token, password }) {
    try {
      commit('resetPasswordRequest');
      await UserService.resetPassword(email, token, password);
      commit('resetPasswordComplete');
      dispatch('user/getUser', true, { root: true });
    } catch (e) {
      handleError(commit, e);
    }
  },

  // eslint-disable-next-line camelcase
  async register({ commit, dispatch }, { email, password, tos_agreed }) {
    try {
      commit('registerRequest');
      await UserService.register(email, password, tos_agreed);
      commit('registerSuccess');
      dispatch('user/getUser', true, { root: true });
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
