<template>
  <div class="checkbox-wrapper custom-control" :class="stateClass">
    <input
      type="checkbox"
      :id="guid"
      :value="val"
      v-model="checked"
      @change="onChange"
      :disabled="disabled"
    />
    <label class="checkbox-label" :for="guid">
      <span class="checkbox-tick">
        <svg width="18" height="18"><use xlink:href="/assets/icons/icons.svg#checkbox-tick"/></svg>
      </span>
    </label>
    <small v-if="!empty">
      <label :for="guid" class="mb-0">
        <slot/>
      </label>
    </small>
  </div>
</template>

<script>
  export default {
    name: 'CheckBox',
    props: {
      value: {
        required: true,
      },
      val: {
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      state: {
        required: false,
      },
      disabled: Boolean,
      empty: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({ guid: null, checkedProxy: false }),
    created() {
      this.guid = this.name || this.$uid;
    },
    computed: {
      stateClass() {
        switch (this.state) {
          case true:
            return 'is-valid';
          case false:
            return 'is-invalid';
          default:
            return '';
        }
      },
      checked: {
        get() { return this.value; },
        set(val) { this.checkedProxy = val; },
      },
    },
    methods: {
      onChange() {
        this.$emit('input', this.checkedProxy);
      },
    },
  };
</script>
