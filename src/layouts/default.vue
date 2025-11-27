<template>
  <div class="">
      <Header />
      <router-view class="main"/>
  </div>
</template>

<script>
import Header from "@/components/header.vue";

export default {
  components: {
    Header,
  },
};
</script>

<style scoped>
.main {
  margin: 0 auto;
}
</style>