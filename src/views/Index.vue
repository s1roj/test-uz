<template>
  <div class="home">
    <div class="row gap-4 my-4 ms-4">
      <div style="width: 300px" v-for="item of getTest" :key="item._id">
        <router-link :to="`/test/${item._id}`">
          <div class="card">
            <div class="card-body">
              <figure>
                <blockquote class="blockquote">
                  <p>
                    {{ item.title }}
                  </p>
                </blockquote>
                <figcaption class="blockquote-footer">
                  {{ item.desc }}
                </figcaption>
              </figure>
            </div>
          </div>
          <!-- <testCard /> -->
        </router-link>
      </div>
    </div>
    <div>
      <div class="d-flex justify-content-end mx-4">
        <button
          class="btn btn-success d-none"
          :class="{ active: btnSuccess }"
          @click="formActiveFunk()"
        >
          Test Qo'shish
        </button>
        <button
          class="btn btn-warning d-none"
          :class="{ active: btnWarning }"
          @click="formNoActiveFunk()"
        >
          Orqaga
        </button>
      </div>
      <div
        class="d-flex justify-content-center d-none"
        :class="{ active: formActive }"
      >
        <form style="max-width: 1080px; min-width: 576px" @submit.prevent>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Title</label>
            <input type="text" class="form-control" v-model="title" />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Description</label
            >
            <input type="text" class="form-control" v-model="desc" />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Start</label>
            <input type="text" class="form-control" v-model="start" />
          </div>
          <button type="submit" class="btn btn-primary" @click="add()">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import testCard from "@/components/test-card.vue";

export default {
  components: {
    testCard,
  },
  data() {
    return {
      formActive: false,
      btnSuccess: true,
      btnWarning: false,
      title: null,
      desc: null,
      start: null,
      getTest: null,
    };
  },
  created() {
    this.axios.get("http://localhost:3000/api/test/all").then((res) => {
      let result = res.data.data;
      this.getTest = result;
    });
  },
  methods: {
    formActiveFunk() {
      this.formActive = true;
      this.btnSuccess = false;
      this.btnWarning = true;
    },
    formNoActiveFunk() {
      this.formActive = false;
      this.btnSuccess = true;
      this.btnWarning = false;
    },
    add() {
      let data = {
        title: this.title,
        desc: this.desc,
        start: this.start,
      };
      this.axios
        .post("http://localhost:3000/api/test/create", data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.active {
  display: flex !important;
}
</style>
