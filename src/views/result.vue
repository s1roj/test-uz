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

    <div v-if="questions.length" class="questions-list">
      <div
        v-for="(q, qIndex) in questions"
        :key="qIndex"
        class="question-block mb-4 p-3 shadow-sm bg-white rounded"
      >
        <!-- SAVOL SARLAVHASI -->
        <h4 class="mb-3 d-flex align-items-center gap-2">
          <!-- STATUS ICON -->
          <span class="status-icon">
            <span
              v-if="answers[qIndex] === undefined || answers[qIndex] === null"
              class="icon warning"
              title="Javob belgilanmagan"
              >❗</span
            >
          </span>

          <span>
            {{ qIndex + 1 }}.
            <RenderBlocks
              :blocks="q.questionBlocks"
              :baseUrl="BASE_URL"
              context="question"
              mode="inline"
              imgClass="img-fluid d-inline my-2"
              imgStyle="height: 40px;"
            />
          </span>
        </h4>
        <div
          v-for="(opt, optIndex) in q.options"
          :key="optIndex"
          class="px-2 rounded mb-2 option d-flex align-items-center gap-1 shadow-sm"
          :class="getOptionClass(qIndex, optIndex)"
        >
          <strong>{{ optIndex + 1 }}.</strong>

          <RenderBlocks
            :blocks="opt.blocks"
            :baseUrl="BASE_URL"
            context="option"
            mode="inline"
            imgClass="img-fluid d-inline my-2"
            imgStyle="height: 30px;"
          />
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
import { api, studentApi } from "@/services/axios";
import RenderBlocks from "@/components/RenderBlocks.vue";

export default {
  components: {
    RenderBlocks,
  },
  data() {
    return {
      questions: [],
      answers: [],
      correctCount: 0,
      wrongCount: 0,
      total: 0,
      percent: 0,
      grade: 0,
      attemptId: this.$route.params.id,
      BASE_URL: "https://api.tdmau.uz",
    };
  },

  methods: {
    exitFullScreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    },
    // 1. RESULT API da umumiy natijalar va attemptId ni olamiz
    async loadResult() {
      try {
        const res = await api.get("/api/result/" + this.attemptId);

        const result = res.data.data;
        console.log(result);

        // Result ichidan keladigan ma’lumotlar
        this.answers = result.answers;
        this.correctCount = result.correct;
        this.wrongCount = result.wrong;
        this.total = result.total;
        this.percent = result.percent;
        this.grade = result.grade;
        this.attemptId = result.attemptId;

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
        const res = await api.get("/api/attempt/" + this.attemptId);
        this.questions = res.data.data.questions;
      } catch (err) {
        console.log("Attempt API error:", err);
      }
    },

    getOptionClass(qIndex, optIndex) {
      const q = this.questions[qIndex];
      const userAnswer = this.answers?.[qIndex];

      if (userAnswer === undefined || userAnswer === null) return "";

      // foydalanuvchi tanlagan
      if (optIndex === userAnswer) {
        return optIndex === q.correctIndex ? "correct" : "wrong";
      }

      // to‘g‘ri javobni yashil qilib ko‘rsatamiz
      if (optIndex === q.correctIndex) {
        return "correct";
      }

      return "";
    },
  },

  created() {
    this.exitFullScreen();
    this.loadResult();
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
.option {
  border-left: 6px solid #bdbdbd;
}

p {
  font-size: 16px;
  margin: 4px 0;
}
.status-icon {
  font-size: 22px;
}

.icon {
  font-weight: bold;
}

.icon.correct {
  color: #2e7d32; /* yashil */
}

.icon.wrong {
  color: #c62828; /* qizil */
}

.icon.warning {
  color: #f9a825; /* sariq */
}

.option.correct {
  border-left: 6px solid #2e7d32;
}

.option.wrong {
  border-left: 6px solid #c62828;
}
</style>
