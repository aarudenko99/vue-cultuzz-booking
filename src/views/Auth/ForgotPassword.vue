<template>
  <fragment>
    <div class="panel panel-status" v-if="resetPasswordSent">
      <div class="panel-body">
        <img class="panel-image" src="/assets/images/envelop.svg" alt="Envelop image"/>
        <h1>Instructions sent!</h1>
        <p>Instructions for resetting your password have been sent to</p>
        <h3 class="mb-0">{{ email }}</h3>
      </div>
      <div class="panel-footer">
        <p class="m-0">You will receive this email within 5 minutes. Be sure to check your spam folder too.</p>
      </div>
    </div>
    <div class="panel panel-form" v-else>
      <div class="panel-body">
        <img class="panel-image" src="/assets/images/cloud.svg" alt="Cloud image">
        <h1>Forgot your password?</h1>
        <p>Please enter your email and we will send you the instructions</p>
        <ValidationObserver ref="form" slim v-slot="{ handleSubmit }">
          <b-form @submit.prevent.stop="handleSubmit(submitForm)" novalidate>

            <ValidatedField rules="required|email" type="email" name="email" placeholder="name@company.com"
                            v-model.trim="email" autocomplete="email" autofocus
                            :disabled="authenticating" :error-bag="validationError"/>

            <submit-button :loading="authenticating">
              Send me instructions
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
  </fragment>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'ForgotPassword',
    data() {
      return {
        email: '',
      };
    },
    computed: {
      ...mapGetters('auth', ['authenticating', 'validationError', 'resetPasswordSent', 'rateLimitError']),
    },
    methods: {
      ...mapActions('auth', ['sendResetPasswordEmail']),

      submitForm() {
        this.$nextTick(() => this.$refs.form.reset());
        const { email } = this;
        this.sendResetPasswordEmail({ email });
      },
    },
  };
</script>
