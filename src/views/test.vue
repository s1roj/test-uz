<template>
  <div class="">
    <h1 class="pt-4">
      {{ this.test.title }}
    </h1>
    <div>
      <div
        class="d-flex justify-content-around align-items-center mt-4 position-relative">
        <div class="position-absolute top-0 end-0 m-1 ms-3">
          <router-link to="/">
            <svg
              class="back-icon"
              fill="#ffffff"
              height="40px"
              width="40px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 219.15 219.15"
              xml:space="preserve"
              stroke="#ffffff"
              stroke-width="3.0681140000000005">
              <g
                id="SVGRepo_bgCarrier"
                stroke-width="0"
                transform="translate(25.202365,25.202365), scale(0.77)">
                <rect
                  x="0"
                  y="0"
                  width="219.15"
                  height="219.15"
                  rx="109.575"
                  fill="#2c3e50"
                  strokewidth="0"></rect>
              </g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#CCCCCC"
                stroke-width="13.587362000000002"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575 C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575 c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z"></path>
                  <path
                    d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008 c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825 c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628 c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z"></path>
                </g>
              </g>
            </svg>
          </router-link>
          <router-link to="/"
            ><button class="btn btn-danger" @click="deleteTest">
              o'chir
            </button></router-link
          >
        </div>
        <h1 class="">{{ this.test.desc }}</h1>
        <h3>
          Test tugashiga <span>{{ this.test.start }}</span> qoldi
        </h3>
      </div>
      <div class="main container">
        <h2 class="text-center mt-4">Savollar</h2>
        <div class="d-flex flex-column mt-4">
          <div class="question d-flex flex-column mb-4">
            <h3 class="text-start">1. HTML ning to'liq nomi nima?</h3>
            <div class="answers d-flex gap-4">
              <label
                ><input type="radio" name="q1" /> Hyper Text Markup
                Language</label
              >
              <label
                ><input type="radio" name="q1" /> Home Tool Markup
                Language</label
              >
              <label
                ><input type="radio" name="q1" /> Hyperlinks and Text Markup
                Language</label
              >
            </div>
          </div>
          <div class="question d-flex flex-column mb-4">
            <h3 class="text-start">2. CSS ning vazifasi nima?</h3>
            <div class="answers d-flex gap-4">
              <label
                ><input type="radio" name="q2" /> Veb-sahifalarning tuzilishini
                belgilash</label
              >
              <label
                ><input type="radio" name="q2" /> Veb-sahifalarning ko'rinishini
                belgilash</label
              >
              <label
                ><input type="radio" name="q2" /> Veb-sahifalarga interaktivlik
                qo'shish</label
              >
            </div>
          </div>
        </div>
        <div></div>
        <div class="d-flex justify-content-center mb-4">
          <button class="btn btn-success">Javoblarni Yuborish</button>
        </div>
      </div>
    </div>
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
  methods: {
    deleteTest(id) {
      this.axios
        .delete("http://localhost:3000/api/test/delete/" + this.id)
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err, id);
        });
    },
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

<style scoped>
.main {
  background-color: #f8f9fa;
}
label {
  cursor: pointer;
  font-size: 18px;
}
.back-icon {
  cursor: pointer;
}
</style>
