<template>
  <div class="position-relative">
    <div class="position-relative">
      <div class="m-1 ms-3 d-flex justify-content-between align-items-center">
        <router-link to="/" class="d-none" :class="{ active: !btnTest }">
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
            <router-link v-if="role === 'admin'" to="/">
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
        <div class="d-flex justify-content-center align-items-center gap-3">
          <h2 class="my-4">
            Test kodi: <span>{{ test.testCode }}</span>
          </h2>
          <button
            class="btn btn-secondary btn-sm"
            style="max-height: 40px"
            @click="copyParamId">
            Copy
          </button>
        </div>
        <div class="d-flex justify-content-center gap-3">
          <h2>Talabalar natijalari</h2>
          <button
            v-if="this.role === 'admin'"
            class="btn btn-sm btn-secondary"
            style="height: 40px"
            @click="downloadWord">
            Wordga yuklash
          </button>
        </div>

        <div
          v-if="allResults.length === 0"
          class="p-3 mb-3 shadow-sm border rounded">
          <h4>Hozircha natijalar mavjud emas.</h4>
        </div>
        <div
          v-for="(r, index) in allResults"
          :key="index"
          class="p-3 mb-3 shadow-sm border rounded d-flex gap-3 justify-content-center align-items-center mt-3">
          <h4>Talaba: {{ r.studentId.name }}</h4>
          <p><b>Fakultet:</b> {{ r.studentId.faculty }}</p>
          <p><b>Guruh:</b> {{ r.studentId.groupNumber }}</p>
          <p><b>To‘g‘ri:</b> {{ r.correct }}</p>
          <p><b>Noto‘g‘ri:</b> {{ r.wrong }}</p>
          <p><b>Foiz:</b> {{ r.percent }}%</p>
          <p><b>Baho:</b> {{ r.grade }}</p>
          <p><b>Test yakunlangan vaqt:</b> {{ formatDate(r.createdAt) }}</p>
        </div>
      </div>
    </div>
    <div>
      <div
        v-if="this.showAdminPanel === false && this.already !== true"
        class="main container">
        <div class="">
          <div
            v-if="timeLeft"
            class="alert alert-warning text-center position-absolute top-0"
            style="right: 10px">
            Qolgan vaqt: <b>{{ timeLeft }}</b>
          </div>

          <div
            class="d-flex flex-column mt-4"
            v-for="(item, qIndex) in randomTests"
            :key="item._id">
            <div class="question d-flex flex-column mb-4 align-items-start">
              <h3>{{ qIndex + 1 }}. {{ item.question }}</h3>

              <div class="answers d-flex gap-4">
                <div
                  v-for="(option, optIndex) in item.options"
                  :key="optIndex"
                  class="form-check">
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
        </div>
        <p v-if="answerError" class="text-danger fw-bold text-center mt-2">
          {{ answerError }}
        </p>
        <div class="d-flex justify-content-center mb-4">
          <button
            @click="finishExam"
            class="btn btn-success d-none"
            :class="{ active: btnTest }">
            Testni yakunlash
          </button>
        </div>
      </div>
      <div class="mt-4" v-else-if="this.already === true">
        <h2 class="text-center">Siz allaqachon ushbu testni topshirdingiz.</h2>
      </div>
      <div class="mt-4" v-if="this.role === 'student'">
        <div
          :class="{ active: !btnTest }"
          class="d-none alert alert-warning text-start"
          style="max-width: 80%; margin: auto">
          <h5><b>Test ishlash qoidalari</b></h5>
          <ul class="mt-2">
            <li>
              Testni faqat <b>bir marta</b> ishlashingiz mumkin. Qayta
              urinishlar taqiqlanadi.
            </li>
            <li>
              Test boshlangan paytdan boshlab vaqt avtomatik ishlay boshlaydi.
            </li>
            <li>
              Ajratilgan vaqt tugashi bilan test <b>avtomatik yakunlanadi</b>.
            </li>
            <li>
              Boshqa sahifaga o‘tish, brauzerni minimallashtirish yoki sahifani
              yangilash — testni <b>avtomatik yakunlaydi</b>.
            </li>
            <li>
              Boshqa ilovaga o‘tish (ALT + TAB) yoki boshqa tabni ochish ham
              testni <b>avtomatik tugatadi</b>.
            </li>
            <li>
              Test davomida <b>full screen rejimidan chiqish taqiqlanadi</b>.
              Chiqilgan taqdirda test yakunlanadi.
            </li>
            <li>
              Test vaqtida sahifani yopish yoki yangilashga urinish ham testni
              yakunlaydi.
            </li>
            <li>
              Test yakunlangach natijani ko‘rasiz va tizimdan chiqishingiz
              tavsiya etiladi.
            </li>
          </ul>
        </div>
        <button
          class="btn btn-primary d-none m-auto mt-3"
          @click="startExam"
          :class="{ active: !btnTest }">
          Testni boshlash
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
      test: { title: null, desc: null, start: null, testCode: null },
      randomTests: [],
      userAnswers: [],
      randomCount: null,
      attemptId: null,
      resultGo: null,
      showAdminPanel: false,
      tests: [],
      role: localStorage.getItem("role"),
      allResults: [],
      already: null,
      btnTest: false,
      testFinished: false,
      timerId: null,
      isSaving: false,
      finishReason: "",
      finishTime: null,
      timeLeft: "",
      testRealId: null,
      answerError: "",
    };
  },

  methods: {
    copyParamId() {
      const text = this.test.testCode;
      navigator.clipboard
        .writeText(text)
        .then(() => {})
        .catch(() => {
          // fallback (eski brauzerlar uchun)
          const textarea = document.createElement("textarea");
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        });
    },
    async loadAllResults() {
      try {
        const res = await this.axios.get(
          "http://10.1.100.230:3000/api/test/" + this.$route.params.id + "/results"
        );

        if (!res.data || !res.data.data) {
          console.log("Natija topilmadi");
          return;
        }
        this.allResults = res.data.data;
        console.log(res.data.data);
      } catch (error) {
        console.log("Natijalarni olishda xatolik:", error);
      }
    },
    enableSecurityEvents() {
      this.enterFullScreen();
      this.watchFullScreen();

      // sahifadan chiqish
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.autoFinishExam("Sahifani tark etish yoki boshqa tabga o'tish.");
        }
      });

      // Alt+Tab yoki minimize
      window.addEventListener("blur", () => {
        this.autoFinishExam("Brauzer fokusini tark etish.");
      });

      // sahifa yangilanishi yoki yopilishi
      window.addEventListener("beforeunload", (e) => {
        this.autoFinishExam("Sahifani yangilash yoki yopish.");
      });
    },
    startExam() {
      this.btnTest = true;

      let studentId = localStorage.getItem("token");

      this.axios
        .post("http://10.1.100.230:3000/api/attempt/start", {
          studentId,
          testId: this.testRealId,
        })
        .then((res) => {
          // 1) Agar testni oldin tugatgan bo‘lsa:
          if (res.data.already === true) {
            alert("Siz bu testni allaqachon yakunlagansiz!");
            this.$router.push("/result/" + res.data.attemptId);
            return;
          }

          // 2) Savollar kelmagan bo‘lsa
          if (!res.data.questions || !res.data.questions.length) {
            console.error("Savollar kelmadi!");
            return;
          }

          this.randomTests = res.data.questions;
          this.attemptId = res.data.attemptId;
          this.finishTime = new Date(res.data.finishTime);

          this.userAnswers = new Array(this.randomTests.length).fill(null);

          // 3) Faqat talaba boshlaganda kuzatuvlarni yoq
          if (this.role === "student") {
            this.enableSecurityEvents();
          }

          // 4) Taymer
          this.startCountdown();
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
        .post("http://10.1.100.230:3000/api/testOne/upload", fd)
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
        .delete("http://10.1.100.230:3000/api/test/delete/full/" + this.id)
        .then(() => {
          alert("Test va barcha ma’lumotlar o‘chirildi!");
          this.$router.push("/");
        })
        .catch((err) => console.log(err));
    },
    finishExam(force = false) {
      if (force !== "auto") {
        const notAnswered = this.userAnswers.findIndex((a) => a === null);
        if (notAnswered !== -1) {
          this.answerError = `${notAnswered + 1}-savolga javob belgilanmagan!`;
          return;
        }
      }

      if (this.testFinished || this.isSaving) {
        return;
      }

      this.testFinished = true;
      this.isSaving = true;

      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      if (
        !this.randomTests ||
        !Array.isArray(this.randomTests) ||
        this.randomTests.length === 0
      ) {
        console.error("Test savollari yuklanmagan, yakunlab bo‘lmaydi!");
        return;
      }

      if (!this.attemptId) {
        console.error("Attempt ID topilmadi, testni yakunlab bo‘lmaydi!");
        return;
      }
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
        .post("http://10.1.100.230:3000/api/result/save", {
          studentId: localStorage.getItem("token"),
          testId: this.testRealId,
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
          localStorage.setItem("result", this.resultGo);
          localStorage.setItem("attemptId", this.attemptId);
          this.$router.push("/result/" + this.attemptId);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    downloadWord() {
      const testId = this.$route.params.id;

      window.open(`http://10.1.100.230:3000/api/test/${testId}/results/word`);
    },
    autoFinishExam(reason) {
      if (this.role !== "student") return;
      if (this.testFinished || this.isSaving) return;

      alert("Test yakunlandi!\nSabab: " + reason);
      this.finishExam("auto");
    },
    enterFullScreen() {
      if (this.role !== "student") return;

      const doc = document.documentElement;

      if (doc.requestFullscreen) doc.requestFullscreen();
      else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
      else if (doc.mozRequestFullScreen) doc.mozRequestFullScreen();
      else if (doc.msRequestFullscreen) doc.msRequestFullscreen();
    },
    watchFullScreen() {
      if (this.role !== "student") return;

      document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
          this.autoFinishExam("Full screen rejimidan chiqildi.");
        }
      });
    },
    startCountdown() {
      this.timerId = setInterval(() => {
        if (this.testFinished) {
          clearInterval(this.timerId);
          this.timerId = null;
          return;
        }

        const now = new Date();
        const diff = this.finishTime - now;

        if (diff <= 0) {
          clearInterval(this.timerId);
          this.timerId = null;
          alert("Vaqt tugadi! Test avtomatik yakunlanadi.");
          this.autoFinishExam("Vaqt tugadi.");
          return;
        }

        let m = Math.floor(diff / 60000);
        let s = Math.floor((diff % 60000) / 1000);

        this.timeLeft = `${m}m : ${s}s`;
      }, 1000);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      date.setHours(date.getHours());
      return date.toLocaleString("uz-UZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },

  created() {
    if (this.role === "student") {
      this.axios
        .get("http://10.1.100.230:3000/api/test/byCode/" + this.id)
        .then((res) => {
          const t = res.data.data;
          this.testRealId = t._id;
          this.test.title = t.title;
          this.test.desc = t.desc;
          this.test.start = t.start;
          this.test.testCode = t.testCode;
        })
        .catch((err) => console.log(err));

      this.role = localStorage.getItem("role");
    }

    if (this.role === "admin" || this.role === "teacher") {
      this.showAdminPanel = true;

      this.axios
        .get("http://10.1.100.230:3000/api/test/byId/" + this.id)
        .then((res) => {
          const t = res.data.data;
          this.testRealId = t._id;
          this.test.title = t.title;
          this.test.desc = t.desc;
          this.test.start = t.start;
          this.test.testCode = t.testCode;
        })
        .catch((err) => console.log(err));

      this.role = localStorage.getItem("role");
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
.active {
  display: block !important;
}
p,
h4 {
  margin: 0 !important;
}
</style>
