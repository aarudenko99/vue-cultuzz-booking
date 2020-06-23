<template>
  <b-form-input
    type="tel"
    autocomplete="off"
    :placeholder="placeholder"
    :name="name"
    :state="state"
    :value="value"
    @input="updateNumber"
    @countrychange="updateNumber"
    :disabled="disabled"
  />
</template>

<script>
  import intlTelInput from 'intl-tel-input';

  const utilsScript = import('intl-tel-input/build/js/utils');

  const telErrors = {
    0: 'Invalid phone',
    1: 'Invalid country code',
    2: 'Too short',
    3: 'Too long',
    4: 'Invalid phone',
    '-99': 'Invalid phone',
  };

  export default {
    name: 'TelInput',
    props: {
      value: {
        required: true,
      },
      placeholder: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        required: true,
      },
      state: {
        required: false,
      },
      disabled: Boolean,
    },
    data() {
      return {
        iti: null,
      };
    },
    mounted() {
      this.iti = intlTelInput(this.$el, {
        utilsScript,
        nationalMode: false,
        formatOnDisplay: true,
        initialCountry: 'de',
      });
    },
    beforeDestroy() {
      if (this.iti) {
        this.iti.destroy();
        this.iti = null;
      }
    },
    methods: {
      updateNumber() {
        this.$emit('input', this.iti.getNumber());
        this.$emit('valid', this.iti.isValidNumber());
        this.$emit('error', telErrors[this.iti.getValidationError()]);
      },
    },
  };
</script>

<style scoped>

</style>
