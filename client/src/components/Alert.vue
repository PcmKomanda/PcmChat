<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      classes: {
        info: "alert-info",
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-error",
      },
    };
  },
  computed: {},
};
</script>
<template>
  <div class="alert shadow-lg" :class="classes[this.type]">
    <div>
      <div>{{ message }}</div>
    </div>
  </div>
</template>
