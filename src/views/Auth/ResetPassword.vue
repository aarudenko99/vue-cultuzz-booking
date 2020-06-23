<template>
  <div class="panel panel-form">
    <div class="panel-body">
      <img class="panel-image" src="/assets/images/cloud.svg" alt="Cloud image">
      <h1>Reset your password</h1>
      <p>Please enter and confirm new password</p>

      <ValidationObserver ref="form" slim v-slot="{ handleSubmit }">
        <b-form @submit.prevent.stop="handleSubmit(submitForm)" novalidate>
          <input type="hidden" :value="email"/>

          <ValidatedField rules="required_string|min:8" type="password" name="password"
                          placeholder="New password" v-model="password" autocomplete="new-password" autofocus
                          :disabled="authenticating || resetTokenError!=null" :error-bag="validationError"/>

          <ValidatedField rules="required_string|sameAs:@password" type="password" name="password_confirmation"
                          v-model="password_confirmation" placeholder="Confirm new password" autocomplete="new-password"
                          :disabled="authenticating || resetTokenError!=null" :error-bag="validationError"/>

          <div class="alert alert-danger alert-btn-replacement" role="alert" v-if="resetTokenError">
            {{ resetTokenError }} <router-link :to="{ name: 'password.email' }">Try again</router-link>.
          </div>
          <submit-button v-else :loading="authenticating">
            Reset password
          </submit-button>
          <div class="alert alert-danger" role="alert" v-if="rateLimitError">
            {{ rateLimitError.message }}
          </div>
        </b-form>
      </ValidationObserver>
    </div>
    <div class="panel-footer mt-lg">
      <p class="m-0">Don't have an account?
        <router-link :to="{name:'register'}">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'ResetPassword',
    data() {
      return {
        password: '',
        password_confirmation: '',

        token: null,
        email: null,
      };
    },
    created() {
      const { query } = this.$route;
      if (query != null) {
        const { token, email } = query;
        if (token && email) {
          this.token = token;
          this.email = email;
          return;
        }
      }
      this.$router.replace({ name: 'login' });
    },
    computed: {
      ...mapGetters('auth', ['authenticating', 'validationError', 'rateLimitError']),

      resetTokenError() {
        return this.validationError != null ? this.validationError.firstErrorFor('email') : null;
      },
    },
    methods: {
      ...mapActions('auth', ['resetPassword']),

      submitForm() {
        this.$nextTick(() => this.$refs.form.reset());
        const { email, token, password } = this;
        this.resetPassword({
          email,
          token,
          password,
        });
      },
    },
  };
</script>
