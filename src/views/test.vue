<template>
  <div>
    <div class="position-relative">
      <div class="m-1 ms-3 d-flex justify-content-between align-items-center">
        <router-link to="/">
          <button class="btn btn-secondary">Orqaga</button>
        </router-link>

        <div class="d-flex gap-2">
          <div
            v-if="this.showAdminPanel"
            class="d-flex gap-3 align-items-center">
            <!-- FILE UPLOAD -->
            <div>
              <label for="file-upload" class="btn btn-primary">
                Test faylini tanlash
              </label>
              <input
                id="file-upload"
                type="file"
                style="display: none"
                @change="handleFileSelect" />
            </div>

            <!-- RANDOM COUNT INPUT -->
            <input
              type="number"
              class="form-control"
              placeholder="Testlar soni"
              v-model="randomCount"
              style="width: 125px" />

            <!-- YUBORISH BUTTON -->
            <button class="btn btn-success" @click="uploadTestFile">
              Yuklash
            </button>
            <router-link to="/">
              <button class="btn btn-danger" @click="deleteTest">
                O'chirish
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <h1 class="pt-4">{{ test.title }}</h1>
    <div v-if="showAdminPanel">
      <div v-if="role === 'admin' || role === 'teacher'" class="mt-4">
        <h2>Talabalar natijalari</h2>

        <div
          v-for="(r, index) in allResults"
          :key="index"
          class="p-3 mb-3 shadow-sm border rounded">
          <h4>Talaba ID: {{ r.studentId }}</h4>
          <p><b>To‘g‘ri:</b> {{ r.correct }}</p>
          <p><b>Noto‘g‘ri:</b> {{ r.wrong }}</p>
          <p><b>Foiz:</b> {{ r.percent }}%</p>
          <p><b>Baho:</b> {{ r.grade }}</p>
        </div>
      </div>
    </div>
    <div v-if="this.showAdminPanel === false" class="main container">
      <h2 class="text-center mt-4">Savollar</h2>

      <div
        class="d-flex flex-column mt-4"
        v-for="(item, qIndex) in randomTests"
        :key="item._id">
        <div class="question d-flex flex-column mb-4 align-items-start">
          <h3>{{ qIndex + 1 }}. {{ item.question }}</h3>

          <div class="answers d-flex gap-4">
            <div v-for="(option, optIndex) in item.options" :key="optIndex" class="form-check">
              <label class="form-check-label">
                <input
                class="form-check-input"
                  type="radio"
                  :name="'question_' + qIndex"
                  :value="optIndex"
                  v-model="userAnswers[qIndex]" />
                {{ option }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center mb-4">
        <button @click="finishExam" class="btn btn-success">
          Testni yakunlash
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      randomCount: null,
      selectedFile: null,
      test: { title: null, desc: null, start: null },
      randomTests: [],
      userAnswers: [],
      randomCount: null,
      attemptId: null,
      resultGo: null,
      showAdminPanel: false,
      tests: [],
      role: localStorage.getItem("role"),
      allResults: [],
    };
  },

  methods: {
    async loadAllResults() {
      try {
        const res = await this.axios.get(
          "http://localhost:3000/api/test/" + this.$route.params.id + "/results"
        );

        if (!res.data || !res.data.data) {
          console.log("Natija topilmadi");
          return;
        }

        this.allResults = res.data.data;

        // console.log("Teacher/Admin Results:", this.allResults);
      } catch (error) {
        console.log("Natijalarni olishda xatolik:", error);
      }
    },
    startExam() {
      let studentId = localStorage.getItem("demoStudentId");
      if (!studentId) {
        studentId = "demo_" + Math.random().toString(36).substring(2, 10);
        localStorage.setItem("demoStudentId", studentId);
      }

      this.axios
        .post("http://localhost:3000/api/attempt/start", {
          studentId,
          testId: this.id,
        })
        .then((res) => {
          this.randomTests = res.data.questions;
          this.attemptId = res.data.attemptId;
          this.userAnswers = new Array(this.randomTests.length).fill(null);
          // console.log(res.data);
        })
        .catch((err) => {
          console.log("Start attempt error:", err);
        });
    },
    handleFileSelect(event) {
      this.selectedFile = event.target.files[0];
      console.log("Tanlangan fayl:", this.selectedFile);
    },
    uploadTestFile() {
      if (!this.selectedFile) {
        alert("Iltimos test faylini yuklang");
        return;
      }

      if (!this.randomCount) {
        alert("Random testlar sonini kiriting");
        return;
      }

      const fd = new FormData();
      fd.append("file", this.selectedFile);
      fd.append("testId", this.id);
      fd.append("randomCount", this.randomCount);

      this.axios
        .post("http://localhost:3000/api/testOne/upload", fd)
        .then((res) => {
          console.log(res.data);
          alert("Testlar muvaffaqiyatli yuklandi!");
          window.location.reload();
        })
        .catch((err) => console.log("Upload error:", err));
    },

    deleteTest() {
      if (!confirm("Test va barcha ma’lumotlar o‘chirilsinmi?")) return;

      this.axios
        .delete("http://localhost:3000/api/test/delete/full/" + this.id)
        .then(() => {
          alert("Test va barcha ma’lumotlar o‘chirildi!");
          this.$router.push("/");
        })
        .catch((err) => console.log(err));
    },
    finishExam() {
      let correct = 0;

      for (let i = 0; i < this.randomTests.length; i++) {
        if (this.userAnswers[i] === this.randomTests[i].correctIndex) {
          correct++;
        }
      }

      const wrong = this.randomTests.length - correct;
      const percent = Math.round((correct / this.randomTests.length) * 100);

      let grade = 2;
      if (percent >= 90) grade = 5;
      else if (percent >= 80) grade = 4;
      else if (percent >= 70) grade = 3;

      this.axios
        .post("http://localhost:3000/api/result/save", {
          studentId: localStorage.getItem("demoStudentId"),
          testId: this.id,
          attemptId: this.attemptId,
          correct,
          wrong,
          total: this.randomTests.length,
          percent,
          grade,
          answers: this.userAnswers,
        })
        .then((res) => {
          this.resultGo = res.data.data._id;
          localStorage.setItem("attempt", "true");
          localStorage.setItem("result", this.resultGo);
          localStorage.setItem("attemptId", this.attemptId);
          this.$router.push("/result/" + this.attemptId);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  created() {
    this.startExam();
    this.axios
      .get("http://localhost:3000/api/test/byId/" + this.id)
      .then((res) => {
        const t = res.data;
        this.test.title = t.title;
        this.test.desc = t.desc;
        this.test.start = t.start;
      })
      .catch((err) => console.log(err));
    if (localStorage.getItem("attempt") === "true") {
      if (localStorage.getItem("role") === "student") {
        this.$router.push("/result/" + localStorage.getItem("attemptId"));
        return;
      }
    }
    this.role = localStorage.getItem("role");

    if (this.role === "admin" || this.role === "teacher") {
      this.showAdminPanel = true; // admin bo‘limini ko‘rsatish
    }
    if (this.role === "admin" || this.role === "teacher") {
      this.loadAllResults();
    }
  },
};
</script>

<style scoped>
.main {
  background-color: #f8f9fa;
}

label {
  cursor: pointer;
  font-size: 16px;
}

input[type="file"] {
  display: none;
}
</style>
