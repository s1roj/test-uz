<template>
  <div class="home">
    <div v-if="getRole == 'admin' || getRole == 'teacher'">
      <div class="d-flex justify-content-end mx-4 mt-3 gap-3">
        <button
          class="btn btn-success d-none"
          :class="{ active: btnSuccess }"
          @click="formActiveFunk()">
          Test Qo'shish
        </button>
        <div v-if="getRole === 'admin'">
          <router-link class="btn btn-primary" to="/admin"
            >Admin panel</router-link
          >
        </div>
      </div>
      <div
        class="d-flex justify-content-center d-none"
        :class="{ active: formActive }">
        <div class="modal" style="display: block">
          <div
            class="modal-dialog"
            style="margin: auto; min-width: 65%; top: 25%; margin: auto">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Test Qo'shish</h5>
                <button
                  @click="formNoActiveFunk()"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form
                  @submit.prevent
                  style="max-width: 1080px; min-width: 576px">
                  <div class="mb-3">
                    <label for="exampleInputTitle" class="form-label"
                      >Test mavzusi</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="exampleInputTitle"
                      v-model="title" />
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputDesc" class="form-label"
                      >Izoh</label
                    >
                    <textarea
                      id="exampleInputDesc"
                      class="form-control"
                      v-model="desc"></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputTime" class="form-label"
                      >Test uchun berilgan vaqt</label
                    >
                    <input
                      id="exampleInputTime"
                      type="number"
                      class="form-control"
                      v-model="duration"
                      placeholder="Minutlarda.." />
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="add()">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container row">
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
          </router-link>
        </div>
      </div>
    </div>
    <div v-else class="row flex-column gap-4 my-4 ms-4 main_test">
      <h2 class="fw-bold">
        Termiz davlat muhandistlik va agrotexnologiyalar universiteti <br />Test
        sayti
      </h2>
      <div class="d-flex">
        <form @submit.prevent class="row g-3 justify-content-center m-auto">
          <div class="col-auto">
            <h3>Test Kodini kiriting:</h3>
          </div>
          <div class="col-auto">
            <input
              id="testCode"
              type="text"
              class="form-control"
              placeholder="Test kodi..."
              v-model="testCode" />
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-primary mb-3" @click="testCod">
              Kirish
            </button>
          </div>
        </form>
      </div>
      <p class="d-none text-danger" :class="{ active: testCodeError }">
        TEST KODI XATO
      </p>
      <div class="relative">
        <h5 class="alert alert-warning mt-5 m-auto" style="max-width: 80%">
          Test yakunlangach profilingizdan chiqib ketishingizni so'raymiz bu
          sizning malumotlaringiz hafsizligini taminlash uchun !
        </h5>
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
      testCode: null,
      formActive: false,
      btnSuccess: true,
      btnWarning: false,
      title: null,
      desc: null,
      duration: null,
      getTest: null,
      getRole: localStorage.getItem("role"),
      testCodeError: false,
    };
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
        duration: this.duration,
      };
      this.axios
        .post("http://10.1.100.230:3000/api/test/create", data)
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    testCod() {
      if (this.testCode) {
        this.axios
          .get(`http://10.1.100.230:3000/api/test/byCode/` + this.testCode)
          .then((res) => {
            const testCode = res.data.data.testCode;
            this.$router.push(`/test/${testCode}`);
          })
          .catch(() => {
            this.testCodeError = true;
          });
      }
    },
  },
  created() {
    this.axios.get("http://10.1.100.230:3000/api/test/all").then((res) => {
      let result = res.data.data;
      this.getTest = result;
    });
  },
};
</script>

<style scoped>
.active {
  display: block !important;
}
.main_test {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
