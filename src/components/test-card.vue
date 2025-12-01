<template>
<<<<<<< HEAD
  <div></div>
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
=======
  <div class="card">
    <div class="card-body">
      <div>
        <div class="blockquote">
          <p>Agrobiyologiyalar fani</p>
        </div>
        <div class="blockquote-footer">
          <span>Yakuniy nazorat uchun test</span>
        </div>
      </div>
>>>>>>> 4ffa917255d121100f607d540ff8c715efeb7502
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
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
=======
export default {};
>>>>>>> 4ffa917255d121100f607d540ff8c715efeb7502
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
<<<<<<< HEAD
=======
.blockquote p {
  color: #2c3e50;
}
>>>>>>> 4ffa917255d121100f607d540ff8c715efeb7502
</style>
