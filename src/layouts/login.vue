<template>
  <div class="login">
    <div class="">
      <div class="login_in d-flex flex-column text-center mt-5">
        <h1 class="title">
          Termiz davlat muhandistlik va agrotexnologiyalar universiteti
        </h1>
        <div class="d-none" :class="{ active: !activeTeacher }">
          <h2 class="text">Kirish</h2>
          <div class="form d-flex flex-column align-items-center m-5 gap-3">
            <input
              class="form_in"
              type="text"
              placeholder="Loginingizni kiriting..."
              v-model="data.login"
            />
            <input
              class="form_in"
              type="password"
              placeholder="Parolingizni kiriting..."
              v-model="data.password"
            />
            <a style="cursor: pointer" @click="activeTech">Ustozlar uchun</a>
            <button class="btn-form" @click="register">Kirish</button>
          </div>
        </div>
        <div class="d-none" :class="{ active: activeTeacher }">
          <h2 class="text">Ustozlar uchun</h2>
          <div class="form d-flex flex-column align-items-center m-5 gap-3">
            <div class="d-flex justify-content-center form_number">
              <span class="col-2 phone-input">+998</span>
              <input
                type="number"
                class="col-10 form_inn phone-input"
                placeholder="90 123 45 67"
                v-model="admin.phone"
              />
            </div>
            <input
              class="form_in"
              type="password"
              placeholder="Parolingizni kiriting..."
              v-model="admin.password"
            />
            <a style="cursor: pointer" @click="activeTech">Talabalar uchun</a>
          </div>
          <button type="button" class="btn-form" @click="login">Kirish</button>
        </div>
      </div>
    </div>
  </div>
</template>
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
    login() {
      console.log(this.admin);

      if (!this.admin.phone || !this.admin.password) {
        alert("Iltimos barcha maydonlarni to'ldiring!");
        return;
      }

      // Maxsus super-admin
      if (
        this.admin.phone === 997445218 &&
        this.admin.password === "siroojidd1n"
      ) {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("role", "admin");
        this.$router.push({ name: "home" });
        return;
      }

      // Oddiy admin login
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
    register() {
      if (this.data.login == null || this.data.password == null) {
        alert("Iltimos barcha maydonlarni to'ldiring!");
        return;
      }
      studentApi
        .post("/v1/auth/login", this.data)
        .then((res) => {
          console.log(res.data);
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
.form_inn,
span {
  border: none;
  outline: none;
  font-size: 20px;
  line-height: 21px;
  font-weight: 400;
  padding: 21px;
  border-radius: 15px;
  background-color: #e6e6e6;
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
