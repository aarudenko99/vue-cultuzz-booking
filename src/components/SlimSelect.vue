<template>
  <select
    class="custom-control"
    :class="stateClass"
    :name="name"
    :value="value"
    autocomplete="off"
    :disabled="disabled"
    @change="updateValue"
  ></select>
</template>

<script>
  import SlimSelect from 'slim-select';

  export default {
    name: 'SlimSelect',
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
      options: {
        required: true,
        validator: (prop) => prop === null || Array.isArray(prop),
      },
      searchable: {
        type: Boolean,
        default: false,
      },
      disabled: Boolean,
    },
    data() {
      return {
        sel: null,
      };
    },
    mounted() {
      this.sel = new SlimSelect({
        select: this.$el,
        showSearch: this.searchable,
        placeholder: this.placeholder,
        allowDeselect: true,
        addToBody: true,
        data: this.selectOptions,
      });
    },
    beforeDestroy() {
      if (this.sel) {
        this.sel.destroy();
        this.sel = null;
      }
    },
    computed: {
      selectOptions() {
        return [
          {
            text: '',
            placeholder: true,
          },
          ...(this.options || []).map(({ code: value, name: text }) => ({ text, value })),
        ];
      },
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
    },
    watch: {
      options() {
        if (!this.sel) return;
        this.sel.setData(this.selectOptions);
      },
      disabled(disabled) {
        if (!this.sel) return;
        if (disabled) {
          this.sel.disable();
        } else {
          this.sel.enable();
        }
      },
    },
    methods: {
      updateValue($ev) {
        this.$emit('input', $ev.target.value);
      },
    },
  };
</script>

<style scoped>

</style>
