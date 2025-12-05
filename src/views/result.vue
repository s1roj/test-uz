<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Imtihon natijalari</h1>

    <!-- Statistics -->
    <div v-if="attemptId" class="stats-box mb-4 p-3 shadow-sm bg-white rounded">
      <h3>Umumiy natija</h3>
      <p><strong>To‘g‘ri javoblar:</strong> {{ correctCount }}</p>
      <p><strong>Noto‘g‘ri javoblar:</strong> {{ wrongCount }}</p>
      <p><strong>Jami savollar:</strong> {{ total }}</p>
      <p><strong>To‘g‘ri foiz:</strong> {{ percent }}%</p>
      <p><strong>Baho:</strong> {{ grade }}</p>
    </div>

    <!-- Questions & answers -->
    <div v-if="questions.length" class="questions-list">
      <div
        v-for="(q, qIndex) in questions"
        :key="qIndex"
        class="question-block mb-4 p-3 shadow-sm bg-white rounded">
        <h4>{{ qIndex + 1 }}. {{ q.question }}</h4>

        <div v-for="(opt, optIndex) in q.options" :key="optIndex">
          <p :style="getStyle(qIndex, optIndex)">
            {{ optIndex + 1 }}. {{ opt }}
          </p>
        </div>
      </div>
    </div>

    <div class="text-center my-4">
      <router-link to="/" class="btn btn-primary"
        >Bosh sahifaga qaytish</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [], // attempt API
      answers: [], // result API
      correctCount: 0,
      wrongCount: 0,
      total: 0,
      percent: 0,
      grade: 0,

      attemptId: localStorage.getItem("attemptId"),
    };
  },

  methods: {
    // 1. RESULT API da umumiy natijalar va attemptId ni olamiz
    async loadResult() {
      try {
        const res = await this.axios.get(
          "http://localhost:3000/api/result/" + this.attemptId
        );

        const result = res.data.data;

        // Result ichidan keladigan ma’lumotlar
        this.answers = result.answers;
        this.correctCount = result.correct;
        this.wrongCount = result.wrong;
        this.total = result.total;
        this.percent = result.percent;
        this.grade = result.grade;
        this.attemptId = result.attemptId;
        console.log("Result data:", result);

        // Endi questions ni olishga o'tamiz
        this.loadAttempt();
      } catch (err) {
        console.log("Result API error:", err);
      }
    },

    // 2. ATTEMPT API orqali savollarni olish
    async loadAttempt() {
      if (!this.attemptId) return;

      try {
        const res = await this.axios.get(
          "http://localhost:3000/api/attempt/" + this.attemptId
        );
        this.questions = res.data.data.questions;
        log("Attempt data:", res.data.data);
      } catch (err) {
        console.log("Attempt API error:", err);
      }
    },

    // 3. Variantlarni ranglash
    getStyle(qIndex, optIndex) {
      if (!this.questions.length || !this.answers.length) return "";

      const correctIndex = this.questions[qIndex].correctIndex;
      const userAnswer = this.answers[qIndex];

      // to'g'ri javob variant
      if (optIndex === correctIndex) {
        return "background:#4caf50;color:white;";
      }

      // foydalanuvchi noto'g'ri belgilagan variant
      if (optIndex === userAnswer && userAnswer !== correctIndex) {
        return "background:#f44336;color:white;";
      }

      return "";
    },
  },

  created() {
    this.loadResult(); // birinchi result → keyin attempt yuklanadi
  },
};
</script>

<style scoped>
.stats-box {
  border-left: 5px solid #0d6efd;
}

.question-block {
  border-left: 4px solid #198754;
}

p {
  font-size: 16px;
  margin: 4px 0;
}
</style>
