<template>
  <div class="panel panel-form">
    <div class="panel-body">
      <img class="panel-image" src="/assets/images/cloud.svg" alt="Cloud image">
      <h1>Welcome back</h1>
      <p>Please enter your email and password to log in your account</p>
      <ValidationObserver ref="form" slim v-slot="{ handleSubmit }">
        <b-form @submit.prevent.stop="handleSubmit(submitForm)" novalidate>
          <ValidatedField rules="required|email" placeholder="name@company.com" type="email" name="email"
                          v-model.trim="email" autocomplete="email" autofocus
                          :disabled="authenticating" :error-bag="validationError"/>
          <ValidatedField rules="required" placeholder="Password" name="password" type="password" v-model="password"
                          autocomplete="current-password" local
                          :disabled="authenticating" :error-bag="validationError"/>

          <b-form-invalid-feedback class="mt-0 mb-1" :class="{'d-block':authError}">
            {{ authError }}
          </b-form-invalid-feedback>
          <submit-button :loading="authenticating">Log In</submit-button>
          <div class="alert alert-danger" role="alert" v-if="rateLimitError">
            {{ rateLimitError.message }}
          </div>
        </b-form>
      </ValidationObserver>
      <router-link :to="{ name:'password.email' }" :disabled="authenticating">Forgot your password?</router-link>
    </div>
    <div class="panel-footer">
      <p class="m-0">Don't have an account?
        <router-link :to="{ name:'register' }" :disabled="authenticating">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    computed: {
      ...mapGetters('auth', ['authenticating', 'authError', 'validationError', 'rateLimitError']),
    },
    methods: {
      ...mapActions('auth', ['login']),

      submitForm() {
        const { email, password } = this;
        this.$nextTick(() => this.$refs.form.reset());
        this.login({
          email,
          password,
        });
      },
    },
  };
</script>
