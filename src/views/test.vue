<template>
  <div>
    <div class="d-flex justify-content-around align-items-center mt-4">
      <h1 class="">Test Sahifasi</h1>
      <h3>Test tugashiga <span>00:15:45</span> qoldi</h3>
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
              ><input type="radio" name="q1" /> Home Tool Markup Language</label
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
      <div>
        
      </div>
      <div class="d-flex justify-content-center mb-4">
        <button class="btn btn-success">Javoblarni Yuborish</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.main {
  background-color: #f8f9fa;
}
label{
    cursor: pointer;
    font-size: 18px;
}
</style>
