<template>
  <div class="login">
    <div class="">
      <div class="login_in d-flex flex-column text-center mt-5">
        <h1 class="title">Termiz davlat muhandistlik va agrotexnologiyalar universiteti</h1>
        <h2 class="text">Login</h2>
        <form class="form d-flex flex-column align-items-center m-5">
          
            <input
              class="form_in number_end"
              type="text"
              placeholder="Logingizni Kiriting..."
              v-model="data.phone"
            />
          
          <input
            class="form_in"
            type="password"
            placeholder="Parolingizni Kiriting..."
            v-model="data.password"
          />
          <p class="text-danger">{{ xato }}</p>
          <button class="btn-form" @click="login">Login</button>
        </form> 
        <p>login: siroj parol: 1234</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        phone: null,
        password: null,
      },
      myPhone: "siroj",
      myPassword: "1234",
      xato: null,
    };
  },
  methods: {
    login() {
      if (
        this.data.phone == this.myPhone &&
        this.data.password == this.myPassword
      ) {
        localStorage.setItem("token", "bu_token");
        this.$router.push({ name: "home" });
      } else {
        this.xato = "Parol Yoki Raqam Xato!!";
      }
    },
  },
};
</script>

<style scoped>
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
  color: #0C8E36;
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
  padding:21px !important;
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
  outline-color: #0C8E36;
}
.btn-form {
  margin-top: 50px;
  font-weight: 700;
  font-size: 20px;
  line-height: 21px;
  padding: 21px 69.5px;
  border: none;
  border-radius: 15px;
  background-color: #0C8E36;
  color: #ffffff;
}
.btn-form:hover {
  background-color: #fff;
  color: #0C8E36;
  border: 2px solid #0C8E36;
}
</style>
