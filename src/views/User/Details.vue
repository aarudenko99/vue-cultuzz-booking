<template>
  <div class="panel panel-form">
    <div class="panel-body">
      <img class="panel-image" src="/assets/images/cloud.svg" alt="Envelop image"/>
      <h1>{{ pdFilled ? 'Contact' : 'Your' }} details</h1>
      <p>Please {{ pdFilled ? 'insert your contact details' : 'enter your full name and property or hotel name' }}</p>

      <ValidationObserver ref="form" slim v-slot="{ handleSubmit }">
        <b-form @submit.prevent.stop="handleSubmit(submitForm)" novalidate>
          <template v-if="!pdFilled">
            <b-form-row>
              <ValidatedField group-class="col-md-6" name="first_name" v-model.trim="first_name"
                              placeholder="First name" autocomplete="given-name" autofocus
                              rules="required|max:255" :error-bag="validationError" :disabled="pending"/>

              <ValidatedField group-class="col-md-6" name="last_name" v-model.trim="last_name"
                              placeholder="Last name" autocomplete="family-name"
                              rules="required|max:255" :error-bag="validationError" :disabled="pending"/>
            </b-form-row>

            <ValidatedField name="hotel_name" v-model.trim="hotel_name" placeholder="Property or hotel name"
                            rules="required|max:255" :error-bag="validationError" :disabled="pending"/>
          </template>

          <template v-else>
            <ValidatedField name="street" v-model.trim="street"
                            placeholder="Street, No." autocomplete="street-address" autofocus
                            rules="required|max:255" :error-bag="validationError" :disabled="pending"/>

            <b-form-row>
              <ValidatedField group-class="col-md-6" name="tel" v-model.trim="tel" type="tel"
                              autocomplete="tel"
                              rules="required|max:20" :error-bag="validationError" :disabled="pending"/>

              <ValidatedField group-class="col-md-6" name="zip" v-model.trim="zip"
                              placeholder="Postal code" autocomplete="postal-code"
                              rules="required|max:10" :error-bag="validationError" :disabled="pending"/>
            </b-form-row>

            <b-form-row>
              <ValidatedField group-class="col-md-6" name="city" v-model.trim="city"
                              placeholder="City" autocomplete="address-level2"
                              rules="required|max:255" :error-bag="validationError" :disabled="pending"/>

              <ValidatedField group-class="col-md-6" name="country" v-model="country" type="select"
                              placeholder="Country" autocomplete="country-name" :options="countries" searchable
                              rules="required" :error-bag="validationError" :disabled="pending || countries==null"/>
            </b-form-row>

          </template>

          <submit-button :loading="pending">
            {{ pdFilled ? 'Enter CultBooking' : 'Continue' }}
          </submit-button>
          <div class="alert alert-danger" role="alert" v-if="hotelRegistrationError != null">
            {{ hotelRegistrationError }}
          </div>
        </b-form>
      </ValidationObserver>
    </div>
    <div class="panel-footer progress-menu">
      <div class="d-flex justify-content-between">
        <small>Your details</small>
        <small>Contact details</small>
      </div>
      <div class="progress">
        <div class="progress-bar" role="progressbar" :style="{ width: `${progress}%` }"
             :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Details',
    data() {
      return {
        first_name: '',
        last_name: '',
        hotel_name: '',
        street: '',
        tel: '',
        zip: '',
        city: '',
        country: '',
      };
    },
    computed: {
      ...mapGetters('data', ['countries']),
      ...mapGetters('user', ['pdFilled', 'user', 'pending', 'validationError']),

      progress() {
        return this.pdFilled ? 100 : 50;
      },
      hotelRegistrationError() {
        return this.validationError ? this.validationError.firstErrorFor('hotel') : null;
      },
    },
    created() {
      this.updateTitle();
      this.fetchCountries();
    },
    watch: {
      pdFilled() {
        this.updateTitle();
      },
    },
    methods: {
      ...mapActions('data', ['fetchCountries']),
      ...mapActions('user', ['updateProfile']),

      updateTitle() {
        const title = !this.pdFilled ? 'Your Details' : 'Contact Details';
        this.$store.commit('pageTitle', title);
      },

      submitForm() {
        this.$nextTick(() => this.$refs.form.reset());
        if (!this.pdFilled) {
          // eslint-disable-next-line camelcase
          const { first_name, last_name, hotel_name } = this;
          this.updateProfile({
            first_name,
            last_name,
            hotel_name,
          });
        } else {
          const {
            country, city, zip, tel, street,
          } = this;
          this.updateProfile({
            country,
            city,
            zip,
            tel,
            street,
          });
        }
      },
    },
  };
</script>
