<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-5 col-lg-4 d-none" :class="{ active: !activeTeacher }">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="text-center mb-3">
              <img
                src="../assets/logo.png"
                alt="Logo"
                style="max-width: 90px" />
            </div>
            <h6 class="text-center fw-bold mb-1">
              Termiz davlat muhandislik va agrotexnologiyalar universiteti
            </h6>
            <p class="text-center text-muted mb-4">Examin tizimi</p>
            <div>
              <div class="mb-3">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Login"
                    v-model="data.login" />
                </div>
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Parol"
                    v-model="data.password" />
                </div>
              </div>
              <div class="d-grid mb-2">
                <button @click="register" class="btn btn-primary">
                  Kirish
                </button>
              </div>
              <div class="d-grid">
                <button
                  @click="activeTech"
                  type="button"
                  class="btn btn-secondary">
                  Ustozlar uchun
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer text-center small text-muted">
            <a
              style="cursor: pointer"
              class="text-primary"
              href="https://student.tdmau.uz/dashboard/login"
              target="_blank"
              >Login yoki parolni tiklash</a
            >
          </div>
        </div>
      </div>
      <div class="col-md-5 col-lg-4 d-none" :class="{ active: activeTeacher }">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="text-center mb-3">
              <img
                src="../assets/logo.png"
                alt="Logo"
                style="max-width: 90px" />
            </div>
            <h6 class="text-center fw-bold mb-1">
              Termiz davlat muhandislik va agrotexnologiyalar universiteti
            </h6>
            <p class="text-center text-muted mb-4">Examin tizimi / Xodimlar</p>
            <div>
              <div class="mb-3">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Login"
                    v-model="admin.phone" />
                </div>
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Parol"
                    v-model="admin.password" />
                </div>
              </div>
              <div class="d-grid mb-2">
                <button @click="login" class="btn btn-primary">Kirish</button>
              </div>
              <div class="d-grid">
                <button
                  @click="activeTech"
                  type="button"
                  class="btn btn-secondary">
                  Talabalar uchun
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer text-center small text-muted">
            Created by RTTM.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useHead } from "@vueuse/head";

useHead({
  title: "Kirish – Examin TDMAU",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>

<script>
import { api, studentApi } from "@/services/axios";

export default {
  data() {
    return {
      activeTeacher: false,
      data: {
        login: null,
        password: null,
      },
      admin: { phone: null, password: null },
    };
  },
  methods: {
    activeTech() {
      this.activeTeacher = !this.activeTeacher;
    },
    register() {
      if (this.data.login == null || this.data.password == null) {
        alert("Iltimos barcha maydonlarni to'ldiring!");
        return;
      }
      api
        .post("/api/user/student/login", {
          login: this.data.login,
          password: this.data.password,
        })
        .then((res) => {
          const student = res.data;

          localStorage.setItem("token", student.data.token);
          localStorage.setItem("role", "student");

          this.$router.push({ name: "home" });
        })
        .catch((error) => {
          console.log("Login error:", error);
          alert("Login yoki parol xato!");
        });
    },
    login() {
      console.log(this.admin);

      if (!this.admin.phone || !this.admin.password) {
        alert("Iltimos barcha maydonlarni to'ldiring!");
        return;
      }

      api
        .post("/api/admin/login", this.admin)
        .then((res) => {
          if (!res.data.success) {
            alert(res.data.message);
            return;
          }

          const token = res.data.token;
          localStorage.setItem("token", token);
          this.$router.push({ name: "home" });
        })
        .catch((err) => {
          console.log("Login error:", err);
          alert("Server xatosi!");
        });
    },
  },
};
</script>

<style scoped>
.active {
  display: block !important;
}
.title {
  font-weight: 600;
  font-size: 34px;
  line-height: 28px;
  margin: 50px;
}
.text {
  font-weight: 700;
  font-size: 40px;
  line-height: 46px;
}
.sign_in {
  font-weight: 400;
  font-size: 17px;
  line-height: 19px;
  color: #0c8e36;
  cursor: pointer;
}

.form {
  gap: 10px;
}
.form_number {
  position: relative;
  display: flex;
}
.number_start {
  font-size: 20px;
  line-height: 21px;
  font-weight: 400;
  position: absolute;
  align-self: center;
  left: 15px;
}
.number_end {
  padding: 21px !important;
}
.form_number {
  width: 450px;
  background-color: #e6e6e6;
  border-radius: 15px;
  outline-color: #0c8e36;
}
.form_in {
  width: 450px;
  font-size: 20px;
  line-height: 21px;
  font-weight: 400;
  padding: 21px;
  border: none;
  background-color: #e6e6e6;
  border-radius: 15px;
  outline-color: #0c8e36;
}
a {
  /* text-decoration: none; */
  color: #6c757d !important;
}
.btn-form {
  margin-top: 50px;
  font-weight: 700;
  font-size: 20px;
  line-height: 21px;
  padding: 21px 69.5px;
  border: none;
  border-radius: 15px;
  background-color: #0c8e36;
  color: #ffffff;
}
.btn-form:hover {
  background-color: #fff;
  color: #0c8e36;
  border: 2px solid #0c8e36;
}
.phone-input {
  color: #6c757d;
}
</style>
