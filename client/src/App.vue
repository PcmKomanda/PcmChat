<script>
export default {};
</script>

<template>
  <div class="p-0">
    <router-view :key="$route.path" />
  </div>
</template>

<style>
body {
  padding: 0;
}
</style>
