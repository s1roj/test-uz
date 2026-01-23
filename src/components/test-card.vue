<template>
  <div class="card" v-for="item of getTest" :key="item._id">
    <div class="card-body">
      <figure>
        <blockquote class="blockquote">
          <p>
            {{ title }}
          </p>
        </blockquote>
        <figcaption class="blockquote-footer">
          {{ desc }}
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script>
export default {
  name: "TestCard",
  data() {
    return {
      data: {
        title: null,
        desc: null,
        start: null,
        getTest: [],
      },
    };
  },
  created() {
    this.axios.get("http://localhost:3000/api/test/all").then((res) => {
      let result = res.data.data;
      this.getTest.push(result);
    });
  },
};
</script>

<style scoped>
.card {
  margin: 20px;
  width: 300px;
  height: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  text-decoration: none !important;
}
.link {
  text-decoration: none !important;
}
</style>
