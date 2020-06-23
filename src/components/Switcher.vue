<template>
  <div class="switcher-wrapper" :class="stateClass">
    <input
      type="checkbox"
      :id="guid"
      :value="val"
      v-model="checked"
      @change="onChange"
      :disabled="disabled"
    />
    <label class="switcher-label" :for="guid">
      <span class="switcher-button"></span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'Switcher',
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
