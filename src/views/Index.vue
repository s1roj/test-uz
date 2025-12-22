<template>
  <div class="home">
    <div v-if="isJunTeaAd">
      <div v-if="isTeaAd" class="d-flex justify-content-end mx-4 mt-3 gap-3">
        <button
          class="btn btn-success d-none"
          :class="{ active: btnSuccess }"
          @click="formActiveFunk()">
          Test Qo'shish
        </button>
        <div v-if="isAdmin">
          <router-link class="btn btn-primary" to="/admin"
            >Admin panel</router-link
          >
        </div>
      </div>
      <div
        v-if="isTeaAd"
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
                <div style="max-width: 1080px; min-width: 576px">
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
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="add()">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container row">
        <div
          class="mt-4"
          style="width: 300px"
          v-for="item of reversedTests"
          :key="item._id">
          <router-link
            class="text-decoration-none text-dark"
            :to="`/test/${item._id}`">
            <div class="card" style="height: 155px">
              <div class="card-body row align-items-center">
                <figure>
                  <blockquote class="blockquote">
                    <p style="font-weight: bold">
                      {{ item.title }}
                    </p>
                  </blockquote>
                  <figcaption class="blockquote-footer clamp_desc">
                    <span><b>Ustoz:</b>{{ admin.name }}</span>
                    <p><b>Gurux:</b>{{ item.desc }}</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-else
      class="main_test d-flex justify-content-center align-items-center"
      style="min-height: 100vh; background: #f5f7fa">
      <div
        class="card shadow-lg p-4"
        style="max-width: 550px; width: 100%; border-radius: 12px">
        <div class="text-center mb-4">
          <h3 class="fw-bold">
            Termiz davlat muhandistlik va agrotexnologiyalar universiteti
          </h3>
          <h5 class="text-muted">Test platformasi</h5>
        </div>

        <!-- Test code input -->
        <div class="mb-3">
          <label for="testCode" class="form-label fw-semibold"
            >Test kodini kiriting</label
          >
          <input
            id="testCode"
            type="text"
            class="form-control form-control-lg"
            placeholder="Masalan: 4821"
            v-model="testCode" />
        </div>

        <!-- Error -->
        <p class="text-danger mb-2" v-if="testCodeError">TEST KODI XATO</p>

        <!-- Button -->
        <div class="d-grid">
          <button class="btn btn-primary btn-lg" @click="testCod">
            Kirish
          </button>
        </div>

        <!-- Alert info -->
        <div
          class="alert alert-warning mt-4 text-center"
          style="font-size: 15px">
          Test yakunlangach profilingizdan chiqib ketishingizni so'raymiz!
          <br />
          Bu sizning ma'lumotlaringiz xavfsizligini ta'minlash uchun.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import testCard from "@/components/test-card.vue";
import { api } from "@/services/axios";

export default {
  components: {
    testCard,
  },
  data() {
    return {
      admin: null,
      testCode: null,
      formActive: false,
      btnSuccess: true,
      btnWarning: false,
      title: null,
      desc: null,
      duration: null,
      getTest: [],
      getRole: null,
      testCodeError: false,
      token: localStorage.getItem("token"),
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
      api
        .post("/api/test/create", data)
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
        api
          .get(`/api/test/byCode/` + this.testCode)
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
    api.get("/api/test/all").then((res) => {
      let result = res.data.data;
      this.getTest = result;
    });

    const role = localStorage.getItem("role");
    if (role !== "student") {
      api
        .get("/api/admin/decode", {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          let result = res.data;
          if (result.success) {
            api
              .get("/api/admin/" + result.decodedToken.adminId)
              .then((response) => {
                this.getRole = response.data.result.role;
                this.admin = response.data.result;
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            localStorage.clear();
            this.$router.push({ name: "login" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .get("/api/student/me", {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.$store.state.student = res.data.data.data;
          localStorage.setItem("student", JSON.stringify(res.data.data.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  computed: {
    reversedTests() {
      return [...this.getTest].reverse();
    },
    isAdmin() {
      return this.getRole === "admin";
    },
    isTeaAd() {
      return ["admin", "teacher"].includes(this.getRole);
    },
    isJunTeaAd() {
      return ["admin", "teacher", "junior-teacher"].includes(this.getRole);
    },
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
router-link {
  text-decoration: none !important;
}
figcaption {
  margin-bottom: 0 !important;
}
figure {
  margin: 0;
}
.clamp_desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
