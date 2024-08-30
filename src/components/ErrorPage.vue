<template>
  <div class="flex items-center justify-center bg-red-100">
    <p class="text-lg font-semibold text-red-700">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
