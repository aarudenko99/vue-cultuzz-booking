import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import {
  required, email, min, max, confirmed, between, numeric,
  min_value as minValue, max_value as maxValue,
} from 'vee-validate/dist/rules';

Vue.component('ValidationProdiver', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

extend('minvalue', minValue);
extend('maxvalue', maxValue);
extend('email', {
  ...email,
  message: 'This field must be a valid email',
});
extend('required', {
  ...required,
  message: 'This field is required',
});
extend('accepted', {
  validate(value) {
    return required.validate(value, { allowFalse: false });
  },
  message: 'You must accept this',
});
extend('sameAs', {
  validate(value, { target }) {
    return String(value) === String(target);
  },
  params: ['target'],
  message: 'Does not match {target}',
});
extend('required_string', {
  computesRequired: true,
  validate(value) {
    const result = {
      valid: false,
      required: true,
    };
    if (value == null) {
      return result;
    }
    result.valid = !!String(value).length;
    return result;
  },
  message: 'This field is required',
});
extend('min', {
  ...min,
  message: 'Must be at least {length} characters',
});
extend('max', {
  ...max,
  message: 'May not be greater than {length} characters',
});
extend('confirmed', {
  ...confirmed,
  message: 'Confirmation does not match',
});
extend('between', {
  ...between,
  message: 'Number should be {min}-{max}',
});

extend('numeric', {
  ...numeric,
  message: 'This field should be a number',
});

Vue.mixin({
  methods: {
    VState(errors, valid) {
      // eslint-disable-next-line no-nested-ternary
      return errors[0] ? false : (valid ? true : null);
    },
    VVState(errors, valid, field, dirty, errorBag) {
      const validationError = errorBag || this.validationError;
      const isInvalid = validationError && !dirty
        ? validationError.hasErrorsFor(field)
        : false;
      // eslint-disable-next-line no-nested-ternary
      return (isInvalid || errors[0]) ? false : (valid ? true : null);
    },
    VVError(errors, field, dirty, errorBag) {
      const validationError = errorBag || this.validationError;
      const error = validationError && !dirty
        ? validationError.firstErrorFor(field)
        : null;
      return error || errors[0];
    },
  },
});
