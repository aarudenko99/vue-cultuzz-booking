import ApiService from '@/services/api.service';
import StorageService from '@/services/storage.service';
import { AuthError, TooManyAttemptsError, ValidationError } from '@/errors';
import shared from '@/shared';

function handleApiError(error) {
  const { status, data } = error.response;
  const rlr = error.response.headers['x-ratelimit-reset'] || 0;
  switch (status) {
    case 401:
      // TODO: remove user from storage?
      return new AuthError(status, data.message);
    case 422:
      return new ValidationError(status, data.message, data.errors);
    case 429:
      return new TooManyAttemptsError(rlr ? data.message : data.errors.email[0], rlr);
    default:
      return error;
  }
}

const UserService = {
  async getCookie() {
    try {
      ApiService.removeHeader();
      await ApiService.get(shared.cookieEndpoint);
      ApiService.setHeader();
    } catch (error) {
      // FIXME
      // do nothing
    }
  },

  async login(email, password) {
    try {
      // first, obtain session and csrf-cookie
      await this.getCookie();

      // now we can make login request
      await ApiService.post(`${shared.endpoint}/login`, {
        email,
        password,
      });

      // fetch user after successful login
      return await this.getUser();
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async logout(forced = false) {
    if (!forced) {
      try {
        await ApiService.post(`${shared.endpoint}/logout`);
      } catch (e) {
        // do nothing
      }
    }
    StorageService.removeUser();
    ApiService.removeHeader();
    ApiService.disableAuthErrorInterceptor();
  },

  async getUser() {
    try {
      const response = await ApiService.get(`${shared.apiEndpoint}/user`);
      const user = response.data;
      if (typeof user === 'object' && user.id != null) {
        StorageService.setUser(user);
        return user;
      }
      StorageService.removeUser();
      return null;
    } catch (error) {
      StorageService.removeUser();
      throw new AuthError(error.response.status, error.response.data.message);
    }
  },

  async resendEmail() {
    try {
      await ApiService.post(`${shared.endpoint}/email/resend`);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async verifyEmail(id, hash, query) {
    try {
      // const queryParams = (new URLSearchParams(query)).toString();
      const url = `${shared.endpoint}/email/verify/${id}/${hash}`;
      const response = await ApiService.post(url, query);
      let user;
      if (response.status === 204) {
        // already verified
        user = StorageService.getUser();
        user.email_verified = true;
      } else {
        user = response.data;
      }
      StorageService.setUser(user);
      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateProfile(data) {
    try {
      const url = `${shared.apiEndpoint}/user/profile`;
      const response = await ApiService.patch(url, data);
      const user = response.data;
      StorageService.setUser(user);
      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async sendResetPasswordEmail(email) {
    try {
      const url = `${shared.endpoint}/password/email`;
      await ApiService.post(url, { email });
    } catch (error) {
      throw handleApiError(error);
    }
    return true;
  },

  async resetPassword(email, token, password) {
    try {
      const url = `${shared.endpoint}/password/reset`;
      await ApiService.post(url, {
        email,
        token,
        password,
      });
    } catch (error) {
      throw handleApiError(error);
    }
    return true;
  },

  // eslint-disable-next-line camelcase
  async register(email, password, tos_agreed) {
    try {
      await this.getCookie();

      const url = `${shared.endpoint}/register`;
      await ApiService.post(url, {
        email,
        password,
        tos_agreed,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default UserService;
