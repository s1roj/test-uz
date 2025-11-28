<template>
  <nav class="navbar navbar-expand-lg border-bottom">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-canter" href="#">
        <img style="width: 75px" src="@/assets/logo.png" alt="" />
        <h5 class="mt-3 fw-bold">
          TerDMAU <br />
          EXAMIN
        </h5>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav"></div>
        <div class="d-flex ms-auto align-items-center gap-3">
          <h4 class="m-auto">Profil</h4>
          <button @click="exit()" class="btn btn-danger">Chiqish</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    exit() {
      localStorage.removeItem("token");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
h5 {
  color: #0c8e36;
}
</style>
