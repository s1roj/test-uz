<template>
  <div>
    <h1 class="mt-4">
      {{ this.test.title }}
    </h1>
    <div class="row d-flex align-items-center">
      <span class="col-9 text-start ps-5">
        {{ this.test.desc }}
      </span>
      <span class="col-3">
        {{ this.test.start }}
      </span>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      test: {
        title: null,
        desc: null,
        start: null,
      },
    };
  },
  created() {
    this.axios
      .get("http://localhost:3000/api/test/byId/" + this.id)
      .then((res) => {
        let result = res.data;
        this.test.title = result.title;
        this.test.desc = result.desc;
        this.test.start = result.start;
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style></style>
