<template>
  <button :type="type"
          class="btn btn-secondary btn-lg w-100"
          :class="{ 'btn-loading': loading }"
          :disabled="loading"
          v-on="$listeners"
  >
    <slot/>
  </button>
</template>

<script>
  export default {
    name: 'SubmitButton',
    props: {
      loading: Boolean,
      type: {
        type: String,
        default: 'submit',
      },
    },
  };
</script>
