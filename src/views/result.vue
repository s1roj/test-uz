<template>
  <div class="result-container">
    <h1>Imtihon natijalari</h1>

    <p><strong>To‘g‘ri javoblar:</strong> {{ result.correct }}</p>
    <p><strong>Noto‘g‘ri javoblar:</strong> {{ result.wrong }}</p>
    <p><strong>Jami savol:</strong> {{ result.total }}</p>
    <p><strong>To‘g‘ri foiz:</strong> {{ result.percent }}%</p>
    <h2><strong>Baho:</strong> {{ result.grade }}</h2>

    <button @click="restartExam">Yangi test yechish</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: {
        correct: 0,
        wrong: 0,
        total: 0,
        percent: 0,
        grade: 0
      }
    };
  },

  created() {
    const saved = localStorage.getItem("examResult");
    if (saved) {
      this.result = JSON.parse(saved);
    }
  },

  methods: {
    restartExam() {
      localStorage.removeItem("randomTests");
      localStorage.removeItem("examResult");
      this.$router.push("/test"); // qayta test sahifasiga
    }
  }
};
</script>

<style>
.result-container {
  max-width: 500px;
  margin: auto;
  text-align: center;
}
</style>
