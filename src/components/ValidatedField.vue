<template>
  <ValidationProdiver slim :rules="rules" #default="{ errors, passed, dirty }" :vid="name">
    <b-form-group class="position-relative outline-none" :class="[groupClass, {'input-no-icon': noIcon}]">
      <b-form-input v-if="['text','email','number'].indexOf(type) !== -1"
                    :type="type"
                    :placeholder="placeholder"
                    :name="name"
                    :autocomplete="autocomplete"
                    :min="min"
                    :max="max"
                    v-focus:[autofocus]
                    :value="value"
                    @input="$emit('input', $event)"
                    :state="inputState(errors, passed, dirty)"
                    :disabled="disabled"
      />
      <b-form-input v-if="type==='password'"
                    type="password"
                    :placeholder="placeholder"
                    :name="name"
                    :autocomplete="autocomplete"
                    v-focus:[autofocus]
                    v-password-toggler
                    :value="value"
                    @input="$emit('input', $event)"
                    :state="inputState(errors, passed, dirty)"
                    :disabled="disabled"
      />
      <tel-input v-if="type==='tel'"
                 :placeholder="placeholder"
                 :name="name"
                 :value="value"
                 @input="$emit('input', $event)"
                 @valid="telValid = $event"
                 @error="telError = $event"
                 :state="inputState(errors, passed&&telValid, dirty)"
                 :disabled="disabled"
      />
      <slim-select v-if="type==='select'"
                   :placeholder="placeholder"
                   :name="name"
                   :value="value"
                   :disabled="disabled"
                   :state="inputState(errors, passed, dirty)"
                   :options="options"
                   :searchable="searchable"
                   @input="$emit('input', $event)"
      />
      <check-box v-if="type==='checkbox'"
                 :name="name"
                 :value="value"
                 :disabled="disabled"
                 :state="inputState(errors, passed, dirty)"
                 @input="$emit('input', $event)"
      >
        <slot/>
      </check-box>
      <b-form-invalid-feedback tooltip v-if="!noTooltip"
                               :class="{ 'd-block': forceShowError(inputState(errors, passed&&telValid, dirty)) }">
        {{ inputError(errors, dirty) }}
      </b-form-invalid-feedback>
    </b-form-group>
  </ValidationProdiver>
</template>

<script>
  import ValidationError from '@/errors/ValidationError';

  export default {
    name: 'ValidatedField',
    inheritAttrs: false,
    data() {
      return {
        telValid: false,
        telError: null,
      };
    },
    props: {
      value: {
        required: true,
      },
      type: {
        type: String,
        default: 'text',
        validator: (type) => [
          'text', 'tel', 'email',
          'number', 'password', 'checkbox',
          'select', 'custom',
        ].indexOf(type) !== -1,
      },
      min: [Number, String],
      max: [Number, String],
      placeholder: {
        type: String,
        default: '',
      },
      autocomplete: {
        type: String,
        default: 'off',
      },
      autofocus: {
        type: Boolean,
        default: false,
      },
      rules: {
        type: [String, Object],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      options: {
        validator: (prop) => prop === null || Array.isArray(prop),
      },
      searchable: {
        type: Boolean,
        default: false,
      },
      local: {
        type: Boolean,
        default: false,
      },
      groupClass: {
        type: [Object, String],
      },
      errorBag: {
        type: ValidationError,
        default: null,
      },
      disabled: Boolean,
      noIcon: Boolean,
      noTooltip: Boolean,
    },
    methods: {
      forceShowError(state) {
        return this.type === 'tel' ? (state === false) : false;
      },
      inputState(errors, passed, dirty) {
        if (this.disabled) return undefined;
        let errs = errors;
        if (this.type === 'tel' && !errs[0] && !this.telValid) {
          errs = [this.telError];
        }
        return this.local
          ? this.VState(errs, passed)
          : this.VVState(errs, passed, this.name, dirty, this.errorBag);
      },
      inputError(errors, dirty) {
        if (this.disabled) return null;
        let errs = errors;
        if (this.type === 'tel' && !errs[0] && !this.telValid) {
          errs = [this.telError];
        }
        return this.local
          ? errs[0]
          : this.VVError(errs, this.name, dirty, this.errorBag);
      },
    },
  };
</script>

<style>
  .outline-none > [role=group] {
    outline: none !important;
  }
</style>
