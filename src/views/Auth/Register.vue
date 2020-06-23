<template>
  <div class="panel panel-form">
    <div class="panel-body">
      <img class="panel-image" src="/assets/images/cloud.svg" alt="Cloud image">
      <h1>Sign Up</h1>
      <p>Please enter your {{ step ? 'password' : 'email' }} to sign up</p>
      <ValidationObserver ref="form" slim v-slot="{ handleSubmit }">
        <b-form @submit.prevent="handleSubmit(submitForm)" novalidate>
          <ValidatedField rules="required|email" placeholder="name@company.com" type="email" name="email"
                          v-model.trim="email" autocomplete="email" autofocus
                          :disabled="authenticating" :error-bag="validationError"/>

          <ValidatedField v-if="step" rules="required_string|min:8" type="password" name="password"
                          v-model="password" autocomplete="new-password" placeholder="Password" autofocus
                          :disabled="authenticating" :error-bag="validationError"/>

          <submit-button :loading="authenticating">
            {{ step ? 'Sign Up' : 'Continue'}}
          </submit-button>
          <div class="alert alert-danger" role="alert" v-if="rateLimitError">
            {{ rateLimitError.message }}
          </div>

          <ValidatedField :rules="step?'accepted':''" type="checkbox" name="tos_agreed" class="tos-checkbox"
                          v-model="tos_agreed" :disabled="authenticating" :error-bag="validationError">
            By signing up, you confirm that you agree with our
            <a href="https://www.cultbooking.com/terms-conditions/" target="_blank">Terms of Service</a> and
            <a class="d-inline-block" href="https://www.cultbooking.com/privacy-policy/" target="_blank">Privacy
              Policy</a>.
          </ValidatedField>
        </b-form>
      </ValidationObserver>
    </div>
    <div class="panel-footer">
      <p class="m-0">Already have an account?
        <router-link :to="{name:'login'}">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Register',
    data() {
      return {
        step: false,
        email: '',
        password: '',
        tos_agreed: false,
      };
    },
    computed: {
      ...mapGetters('auth', ['authenticating', 'authError', 'validationError', 'rateLimitError']),
    },
    methods: {
      ...mapActions('auth', ['register']),

      submitForm() {
        if (!this.step) {
          this.step = true;
          this.$nextTick(() => {
            this.$refs.form.reset();
          });
          // this.$nextTick(() => this.$refs.password.focus());
          return;
        }
        // eslint-disable-next-line camelcase
        const { email, password, tos_agreed } = this;
        this.$nextTick(() => this.$refs.form.reset());
        this.register({ email, password, tos_agreed });
      },
    },
  };
</script>
