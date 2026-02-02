<template>
  <div class="position-relative">
    <div class="position-relative">
      <div class="m-1 ms-3 d-flex justify-content-between align-items-center">
        <router-link to="/" class="d-none" :class="{ active: !btnTest }">
          <button class="btn btn-secondary">Orqaga</button>
        </router-link>
        <div class="d-flex gap-2">
          <div v-if="isTeaAd" class="d-flex gap-3 align-items-center">
            <label for="file-upload" class="btn btn-primary">
              Test faylini tanlash
            </label>
            <input
              id="file-upload"
              type="file"
              hidden
              @change="handleFileSelect" />

            <input
              type="number"
              class="form-control"
              placeholder="Testlar soni"
              v-model="randomCount"
              style="width: 125px" />

            <button class="btn btn-success" @click="uploadTestFile">
              Yuklash
            </button>
            <button
              class="btn"
              :class="test.isActive ? 'btn-danger' : 'btn-success'"
              @click="toggleTest">
              {{ test.isActive ? "Yopish" : "Ochish" }}
            </button>
            <button v-if="isAdmin" class="btn btn-danger" @click="deleteTest">
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
    <h1 class="pt-4">{{ test.title }}</h1>
    <!-- TODO FOR ADMINS -->
    <div v-if="isJunTeaAd">
      <div>
        <!-- ? HEADER -->
        <div class="my-4 d-flex gap-5 justify-content-center">
          <div class="d-flex justify-content-center align-items-center gap-3">
            <h2 class="m-0">
              Test kodi: <span>{{ test.testCode }}</span>
            </h2>
            <button class="btn btn-secondary btn-sm" @click="copyParamId">
              Copy
            </button>
          </div>
          <div class="d-flex justify-content-center gap-3 align-items-center">
            <h2 class="m-0">Talabalar natijalari</h2>
            <button
              v-if="isTeaAd"
              class="btn btn-sm btn-secondary"
              @click="downloadWord">
              Wordga yuklash
            </button>
          </div>
          <div class="d-flex justify-content-center gap-3 align-items-center">
            <h2 class="m-0">Yuklangan savollar</h2>
            <button class="btn-sm btn btn-secondary" @click="getToggleFunk">
              {{ getToggle ? "Yopish" : "Ko'rish" }}
            </button>
          </div>
        </div>
        <!-- ? BODY TESTS-->
        <div class="m-4">
          <div class="d-none" :class="{ active: getToggle }">
            <div>
              <h2 class="mb-3">
                Yuklangan savollar soni: {{ getTest.length }}
              </h2>
            </div>
            <div
              v-for="(q, qIndex) in getTest"
              :key="q._id || qIndex"
              class="question-card mb-4 p-3 border rounded shadow-sm bg-white position-relative">
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="q-num">{{ qIndex + 1 }}.</div>

                <div class="q-body flex-grow-1 text-start">
                  <RenderBlocks
                    :blocks="q.questionBlocks"
                    :baseUrl="BASE_URL"
                    context="question"
                    imgClass="img-fluid d-inline my-2"
                    imgStyle="height: 40px;" />
                </div>
              </div>
              <button
                class="position-absolute btn btn-sm btn-warning"
                style="top: 10px; right: 100px"
                @click="openQuestionEditModal(q)">
                Tahrirlash
              </button>
              <button
                class="position-absolute btn btn-sm btn-danger"
                style="top: 10px; right: 10px"
                @click="deleteQuestion(q._id)">
                O‘chirish
              </button>

              <div
                v-for="(opt, optIndex) in q.options || []"
                :key="optIndex"
                class="option-card form-check mt-2 rounded shadow-sm"
                :class="{ selected: getAnswers?.[qIndex] === optIndex }">
                <label
                  class="form-check-label d-flex align-items-center gap-2 w-100 m-0"
                  :for="'q_' + qIndex + '_' + optIndex">
                  <input
                    class="form-check-input mt-1"
                    type="radio"
                    :name="'q_' + qIndex"
                    :id="'q_' + qIndex + '_' + optIndex"
                    :value="optIndex"
                    v-model="getAnswers[qIndex]" />

                  <div class="opt-body flex-grow-1 text-start">
                    <RenderBlocks
                      :blocks="opt?.blocks"
                      :baseUrl="BASE_URL"
                      context="option"
                      imgClass="img-fluid d-inline my-2"
                      imgStyle="height: 30px;" />
                  </div>
                </label>
              </div>
              <!-- todo MODEL EDIT TEST -->
              <div class="modal fade" id="editQuestionModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Savolni tahrirlash</h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body" v-if="editingQuestion">
                      <div class="mb-3">
                        <label class="form-label">Correct index</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model.number="editingQuestion.correctIndex" />
                      </div>

                      <div class="mb-3">
                        <label class="form-label"
                          >Savol (questionBlocks JSON)</label
                        >
                        <textarea
                          class="form-control"
                          rows="6"
                          v-model="editingQuestion._questionBlocksJson">
                        </textarea>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Options (options JSON)</label>
                        <textarea
                          class="form-control"
                          rows="8"
                          v-model="editingQuestion._optionsJson">
                        </textarea>
                      </div>
                    </div>

                    <div class="modal-footer">
                      <button class="btn btn-secondary" data-bs-dismiss="modal">
                        Bekor
                      </button>
                      <button class="btn btn-success" @click="saveQuestionEdit">
                        Saqlash
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="allResults.length === 0"
          class="p-3 mb-3 shadow-sm border rounded">
          <h4>Hozircha natijalar mavjud emas.</h4>
        </div>
        <!-- ? BODY RESULTS -->
        <div
          :class="{ 'd-none': getToggle }"
          class="shadow-sm border rounded d-flex gap-3 justify-content-center align-items-center mb-2">
          <div class="table-x table-wrap">
            <table class="table table-sticky w-100">
              <thead>
                <tr>
                  <th>Talaba</th>
                  <th>Fakultet</th>
                  <th>Guruh</th>
                  <th>To‘g‘ri</th>
                  <th>Noto‘g‘ri</th>
                  <th>Foiz</th>
                  <th>Baho</th>
                  <th>Yakunlagan</th>
                  <th v-if="admin.phone === 997445218">Raqami</th>
                  <th v-if="admin.phone === 997445218">Rasmi</th>
                  <th v-if="admin.role === 'admin'">Test natijalari</th>
                  <th v-if="admin.role === 'admin'">Amallar</th>
                </tr>
              </thead>

              <tbody>
                <template
                  v-for="(r, index) in allResults"
                  :key="r._id || index">
                  <tr
                    v-if="r.attemptId && r.attemptId.studentInfo"
                    class="student-row"
                    :id="`row_${r.attemptId._id}`"
                    :class="{
                      'is-open': openedAttemptId === r.attemptId?._id,
                    }">
                    <th class="text-start ps-5">
                      {{ r.attemptId.studentInfo.fullName }}
                    </th>
                    <td>{{ r.attemptId.studentInfo.faculty }}</td>
                    <td>{{ r.attemptId.studentInfo.group }}</td>
                    <td>{{ r.correct }}</td>
                    <td>{{ r.wrong }}</td>
                    <td>{{ r.percent }}%</td>
                    <td>{{ r.grade }}</td>
                    <td>{{ formatDate(r.createdAt) }}</td>

                    <td v-if="admin.phone === 997445218">
                      {{ r.attemptId.studentInfo.studentNumber }}
                    </td>

                    <td v-if="admin.phone === 997445218">
                      <img
                        :src="r.attemptId.studentInfo.studentImage"
                        class="img-fluid d-block rounded"
                        style="max-width: 40px; max-height: 40px" />
                    </td>

                    <td v-if="admin.role === 'admin'">
                      <button
                        v-if="isJunTeaAd"
                        class="btn btn-sm btn-warning"
                        @click="loadResult(r.attemptId._id)">
                        Natijalar
                      </button>
                    </td>

                    <td v-if="admin.role === 'admin'">
                      <button
                        v-if="isAdmin"
                        class="btn btn-sm btn-warning me-2"
                        @click="openEditModal(r)">
                        Tahrirlash
                      </button>
                      <button
                        v-if="isAdmin"
                        class="btn btn-sm btn-warning"
                        @click="resetAttempt(r)">
                        Qayta imkon
                      </button>
                    </td>
                  </tr>
                  <tr
                    v-if="openedAttemptId === r.attemptId?._id"
                    class="detail-row">
                    <td :colspan="admin.phone === 997445218 ? 12 : 10">
                      <div class="mt-3">
                        <div
                          v-if="resultTestQuestions.length"
                          class="detail-scroll">
                          <div
                            v-for="(q, qIndex) in resultTestQuestions"
                            :key="q._id || qIndex"
                            class="p-3 mb-3 shadow-sm bg-white rounded">
                            <div
                              class="d-flex gap-2 align-items-center mb-2 justify-content-center">
                              <span v-if="resultTest.answers[qIndex] == null"
                                >❗</span
                              >
                              <b>{{ qIndex + 1 }}.</b>

                              <RenderBlocks
                                :blocks="q.questionBlocks"
                                :baseUrl="BASE_URL"
                                context="question"
                                mode="inline"
                                imgClass="img-fluid d-inline my-2"
                                imgStyle="height: 40px;" />
                            </div>

                            <div
                              v-for="(opt, optIndex) in q.options"
                              :key="optIndex"
                              class="px-2 py-1 rounded mb-2 shadow-sm"
                              :class="getOptionClass(qIndex, optIndex)">
                              <RenderBlocks
                                :blocks="opt.blocks"
                                :baseUrl="BASE_URL"
                                context="option"
                                mode="inline"
                                imgClass="img-fluid d-inline my-2"
                                imgStyle="height: 30px;" />
                            </div>
                          </div>
                        </div>

                        <div v-else class="alert alert-info">
                          Savollar topilmadi (attempt o‘chgan bo‘lishi mumkin).
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="modal fade" id="editResultModal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Natijani tahrirlash</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-2">
                    <label>To‘g‘ri</label>
                    <input
                      type="number"
                      v-model="editResult.correct"
                      class="form-control" />
                  </div>

                  <div class="mb-2">
                    <label>Noto‘g‘ri</label>
                    <input
                      type="number"
                      v-model="editResult.wrong"
                      class="form-control" />
                  </div>

                  <div class="mb-2">
                    <label>Foiz</label>
                    <input
                      type="number"
                      v-model="editResult.percent"
                      class="form-control" />
                  </div>

                  <div class="mb-2">
                    <label>Baho</label>
                    <select v-model="editResult.grade" va class="form-select">
                      <option :value="2">2</option>
                      <option :value="3">3</option>
                      <option :value="4">4</option>
                      <option :value="5">5</option>
                    </select>
                  </div>
                </div>

                <div class="modal-footer">
                  <button class="btn btn-secondary" data-bs-dismiss="modal">
                    Bekor
                  </button>
                  <button class="btn btn-success" @click="updateResult">
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- TODO FOR STUDENTS -->
    <div>
      <div
        v-if="showAdminPanel === false && this.already !== true"
        class="main container">
        <div class="">
          <div
            v-if="timeLeft"
            class="alert alert-warning text-center timer-fixed">
            Qolgan vaqt: <b>{{ timeLeft }}</b>
          </div>
          <div
            v-for="(q, qIndex) in questions"
            :key="q._id || qIndex"
            class="question-card mb-4 p-3 border rounded shadow-sm bg-white">
            <div class="d-flex align-items-center gap-2 mb-2">
              <div class="q-num">{{ qIndex + 1 }}.</div>

              <div class="q-body flex-grow-1 text-start">
                <RenderBlocks
                  :blocks="q.questionBlocks"
                  :baseUrl="BASE_URL"
                  context="question"
                  imgClass="img-fluid d-inline my-2"
                  imgStyle="height: 30px;" />
              </div>
            </div>

            <div
              v-for="(opt, optIndex) in q.options || []"
              :key="optIndex"
              class="option-card form-check mt-2 rounded shadow-sm"
              :class="{ selected: answers?.[qIndex] === optIndex }">
              <label
                class="form-check-label d-flex align-items-center gap-2 w-100 m-0"
                :for="'q_' + qIndex + '_' + optIndex">
                <input
                  class="form-check-input mt-1"
                  type="radio"
                  :name="'q_' + qIndex"
                  :id="'q_' + qIndex + '_' + optIndex"
                  :value="optIndex"
                  v-model="answers[qIndex]" />

                <div class="opt-body flex-grow-1 text-start">
                  <RenderBlocks
                    :blocks="opt?.blocks"
                    :baseUrl="BASE_URL"
                    context="option"
                    imgClass="img-fluid d-inline my-2"
                    imgStyle="height: 30px;" />
                </div>
              </label>
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
      <div
        class=""
        v-if="this.test.isActive === false && this.role === 'student'">
        <h1 class="text alert alert-danger">Test hozrcha yopiq !</h1>
      </div>
      <div class="mt-4" v-else-if="this.role === 'student'">
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
import { api } from "@/services/axios";
import RenderBlocks from "@/components/RenderBlocks.vue";
import { uiAlert, uiConfirm } from "@/utils/uiDialog";
import * as bootstrap from "bootstrap";

export default {
  components: { RenderBlocks },
  data() {
    return {
      BASE_URL: "https://api.tdmau.uz",
      editResult: {
        _id: "",
        correct: null,
        wrong: null,
        percent: null,
        grade: null,
      },
      id: this.$route.params.id,
      randomCount: null,
      selectedFile: null,
      test: {},
      attemptId: null,
      resultGo: null,
      showAdminPanel: false,
      role: localStorage.getItem("role"),
      admin: null,
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
      testClosed: null,
      student: JSON.parse(localStorage.getItem("student")),
      questions: [],
      answers: null,
      getTest: [],
      getAnswers: [],
      getToggle: false,
      openedAttemptId: null,
      resultTest: {
        answers: [],
        correctCount: 0,
        wrongCount: 0,
        total: 0,
        percent: 0,
        grade: 0,
        attemptId: null,
      },
      resultTestQuestions: [],
      timeUpHandled: false,
      editingQuestion: null,
      editingCorrectIndex: null,
      editingOptionsText: [],
    };
  },

  methods: {
    openQuestionEditModal(q) {
      const copy = JSON.parse(JSON.stringify(q));
      copy._questionBlocksJson = JSON.stringify(
        copy.questionBlocks || [],
        null,
        2,
      );

      copy._optionsJson = JSON.stringify(copy.options || [], null, 2);

      this.editingQuestion = copy;

      const modal = new bootstrap.Modal(
        document.getElementById("editQuestionModal"),
      );
      modal.show();
    },
    async saveQuestionEdit() {
      try {
        if (!this.editingQuestion?._id) return;

        let questionBlocks = [];
        let options = [];

        try {
          questionBlocks = JSON.parse(
            this.editingQuestion._questionBlocksJson || "[]",
          );
        } catch (e) {
          await uiAlert("Savol JSON xato (questionBlocks). To‘g‘rilang!");
          return;
        }

        try {
          options = JSON.parse(this.editingQuestion._optionsJson || "[]");
        } catch (e) {
          await uiAlert("Options JSON xato. To‘g‘rilang!");
          return;
        }

        const payload = {
          questionBlocks,
          options,
          correctIndex: Number(this.editingQuestion.correctIndex),
        };

        await api.put(
          `/api/testOne/update/${this.editingQuestion._id}`,
          payload,
        );

        await uiAlert("Savol yangilandi!");

        bootstrap.Modal.getInstance(
          document.getElementById("editQuestionModal"),
        ).hide();

        this.getTestQuestions();
      } catch (err) {
        console.error(err);
        await uiAlert("Saqlashda xatolik!");
      }
    },
    async deleteQuestion(questionId) {
      const ok = await uiConfirm("Savol o‘chirilsinmi?");
      if (!ok) return;

      try {
        await api.delete(`/api/testOne/delete/${questionId}`);
        await uiAlert("Savol o‘chirildi!");
        this.getTest = this.getTest.filter((q) => q._id !== questionId);
      } catch (err) {
        console.log("Delete question error:", err);
        await uiAlert("Savolni o‘chirishda xatolik!");
      }
    },
    openEditModal(result) {
      this.editResult = { ...result };

      const modal = new bootstrap.Modal(
        document.getElementById("editResultModal"),
      );
      modal.show();
    },
    async toggleTest() {
      const res = await api.put(`/api/test/toggle/${this.testRealId}`);
      this.test.isActive = res.data.isActive;
      console.log(this.test.isActive);
    },
    async updateResult() {
      try {
        await api.put(`/api/result/edit/${this.editResult._id}`, {
          correct: this.editResult.correct,
          wrong: this.editResult.wrong,
          percent: this.editResult.percent,
          grade: this.editResult.grade,
        });

        await uiAlert("Natija yangilandi");

        // modal yopish
        bootstrap.Modal.getInstance(
          document.getElementById("editResultModal"),
        ).hide();

        window.location.reload();
      } catch (err) {
        console.error(err);
        await uiAlert("Xatolik yuz berdi");
      }
    },
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
        const res = await api.get(
          "/api/test/" + this.$route.params.id + "/results",
        );

        if (!res.data || !res.data.data) {
          console.log("Natija topilmadi");
          return;
        }
        this.allResults = res.data.data;
      } catch (error) {
        console.log("Natijalarni olishda xatolik:", error);
      }
    },
    async startExam() {
      this.btnTest = true;
      let studentCode = this.student.student_id_number;
      api
        .post("/api/attempt/start", {
          studentCode,
          testId: this.testRealId,
          studentInfo: {
            fullName: this.student.full_name,
            group: this.student.group.name,
            faculty: this.student.faculty.name,
            studentNumber: this.student.phone,
            studentImage: this.student.image,
          },
        })
        .then(async (res) => {
          if (res.data.reason === "closed") {
            this.testClosed = true;
          }
          if (res.data.already === true) {
            this.$router.push("/result/" + res.data.attemptId);
            await uiAlert("Siz bu testni allaqachon yakunlagansiz!");
            localStorage.removeItem("exam_started");
            window.dispatchEvent(new Event("examStartedChanged"));
            return;
          }
          if (!res.data.questions || !res.data.questions.length) {
            console.error("Savollar kelmadi!");
            return;
          }

          this.questions = res.data.questions;
          this.attemptId = res.data.attemptId;
          this.finishTime = new Date(res.data.finishTime);

          this.answers = new Array(this.questions.length).fill(null);
          if (this.role === "student" && window.examApp?.enterExamMode) {
            await window.examApp.enterExamMode();
          }
          if (this.role === "student") {
            console.log("examApp exists?", !!window.examApp);
            const ok = await window.examApp?.enterExamMode?.();
            console.log("enterExamMode result:", ok);
          }
          this.startCountdown();
          localStorage.setItem("exam_started", "1");
          window.dispatchEvent(new Event("examStartedChanged"));
        })
        .catch((err) => {
          console.log("Start attempt error:", err);
        });
    },
    handleFileSelect(event) {
      this.selectedFile = event.target.files[0];
      console.log("Tanlangan fayl:", this.selectedFile);
    },
    async uploadTestFile() {
      if (!this.selectedFile) {
        await uiAlert("Iltimos test faylini yuklang");
        return;
      }

      if (!this.randomCount) {
        await uiAlert("Random testlar sonini kiriting");
        return;
      }

      const fd = new FormData();
      fd.append("file", this.selectedFile);
      fd.append("testId", this.id);
      fd.append("randomCount", this.randomCount);

      api
        .post("/api/testOne/upload", fd)
        .then(async (res) => {
          console.log(res.data);
          await uiAlert("Testlar muvaffaqiyatli yuklandi!");
          window.location.reload();
        })
        .catch(async (err) => await uiAlert("Yuklashda xatolik:", err));
    },
    async deleteTest() {
      const ok = await uiConfirm("Test va barcha ma’lumotlar o‘chirilsinmi?");
      if (!ok) return;
      api
        .delete("/api/test/delete/" + this.id)
        .then(async () => {
          await uiAlert("Test va barcha ma’lumotlar o‘chirildi!");
          this.$router.push("/");
        })
        .catch((err) => console.log(err));
    },
    finishExam(force = false) {
      if (!Array.isArray(this.answers)) {
        this.answers = [];
      }

      if (force !== "auto") {
        const notAnswered = this.answers.findIndex((a) => a === null);
        if (notAnswered !== -1) {
          this.answerError = `${notAnswered + 1}-savolga javob belgilanmagan!`;
          return;
        }
      }

      if (this.testFinished || this.isSaving) return;

      this.testFinished = true;
      this.isSaving = true;

      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }

      if (!Array.isArray(this.questions) || this.questions.length === 0) {
        console.error("Test savollari yuklanmagan");
        this.isSaving = false;
        return;
      }

      let correct = 0;
      this.questions.forEach((q, index) => {
        if (this.answers[index] === q.correctIndex) correct++;
      });

      const total = this.questions.length;
      const wrong = total - correct;
      const percent = Math.round((correct / total) * 100);

      let grade = 2;
      if (percent >= 90) grade = 5;
      else if (percent >= 70) grade = 4;
      else if (percent >= 60) grade = 3;

      api
        .post("/api/result/save", {
          studentCode: this.student.student_id_number,
          testId: this.testRealId,
          attemptId: this.attemptId,
          correct,
          wrong,
          total,
          percent,
          grade,
          answers: this.answers,
        })
        .then(async (res) => {
          if (this.role === "student" && window.examApp?.exitExamMode) {
            try {
              await window.examApp.exitExamMode();
            } catch (e) {}
          }

          this.$router.push("/result/" + res.data.data.attemptId);

          localStorage.removeItem("exam_started");
          window.dispatchEvent(new Event("examStartedChanged"));
        })
        .catch(async (err) => {
          await uiAlert(
            "Internet yo‘q yoki serverga ulanib bo‘lmadi. Internetni tuzatib, yana 'Yakunlash' ni bosing.",
          );
          this.testFinished = false;
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    startCountdown() {
      this.timeUpHandled = false;

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

          if (this.timeUpHandled) return;
          this.timeUpHandled = true;

          this.timeLeft = "0m : 0s";
          this.finishExam("auto");
          return;
        }

        let m = Math.floor(diff / 60000);
        let s = Math.floor((diff % 60000) / 1000);
        this.timeLeft = `${m}m : ${s}s`;
      }, 1000);
    },
    downloadWord() {
      const testId = this.$route.params.id;

      window.open(
        `https://api.tdmau.uz/api/test/${testId}/results/word`,
        "_blank",
      );
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
    async resetAttempt(result) {
      const ok = await uiConfirm(
        "Talabaga testni qayta topshirish imkoni berilsinmi?",
      );
      if (!ok) return;
      const resultId = result._id;
      const attemptId = result.attemptId._id;

      api
        .delete(`/api/attempt/delete/${attemptId}`)
        .then((res) => {
          console.log("Attempt reset:", res.data);
        })
        .catch((err) => {
          console.error("Attempt reset error:", err);
          return;
        });
      api
        .delete(`/api/result/delete/${resultId}`)
        .then(async (res) => {
          await uiAlert("Talabaga testni qayta topshirish imkoni berildi.");
          window.location.reload();
        })
        .catch((err) => {
          console.error("Result delete error:", err);
        });
    },
    getTestQuestions() {
      if (this.role === "student") return;
      api
        .get("/api/testOne/" + this.id)
        .then((res) => {
          this.getTest = res.data.data || [];
          this.answers = this.getTest.map(() => null);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getToggleFunk() {
      this.getToggle = !this.getToggle;
    },
    setQuestionsFromApi(apiQuestions) {
      this.getTest = Array.isArray(apiQuestions) ? apiQuestions : [];
      this.getAnswers = this.questions.map(() => null);
    },
    async loadResult(attemptId) {
      try {
        // toggle: bosilgan bo'lsa yopilsin
        this.openedAttemptId =
          this.openedAttemptId === attemptId ? null : attemptId;
        if (!this.openedAttemptId) return;

        const res = await api.get("/api/result/" + attemptId);
        const result = res.data.data;

        this.resultTest.answers = result.answers || [];
        this.resultTest.correctCount = result.correct;
        this.resultTest.wrongCount = result.wrong;
        this.resultTest.total = result.total;
        this.resultTest.percent = result.percent;
        this.resultTest.grade = result.grade;

        // attempt savollarini olish
        const a = await api.get("/api/attempt/" + attemptId);
        this.resultTestQuestions = a.data.data.questions || [];

        // ochilgan row yuqoriga kelib header tagida qolmasin
        this.$nextTick(() => {
          const el = document.getElementById(`row_${attemptId}`);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } catch (err) {
        console.log("Result API error:", err);
      }
    },
    async loadAttempt(attemptId) {
      try {
        const res = await api.get("/api/attempt/" + attemptId);
        this.resultTestQuestions = res?.data?.data?.questions || [];
      } catch (err) {
        console.log("Attempt API error:", err);
        this.resultTestQuestions = [];
      }
    },
    getOptionClass(qIndex, optIndex) {
      const userAns = this.resultTest?.answers?.[qIndex];
      const correct = this.resultTestQuestions?.[qIndex]?.correctIndex;

      if (userAns === undefined || userAns === null) return "";
      if (optIndex === userAns && optIndex === correct)
        return "bg-success text-white";
      if (optIndex === userAns && optIndex !== correct)
        return "bg-danger text-white";
      if (optIndex === correct) return "bg-success-subtle";

      return "";
    },
    disableContextMenu(e) {
      e.preventDefault();
      return false;
    },
  },
  mounted() {
    document.addEventListener("contextmenu", this.disableContextMenu);
  },
  beforeRouteLeave(to, from, next) {
    if (this.role === "student" && window.examApp?.exitExamMode) {
      window.examApp.exitExamMode();
    }
    localStorage.removeItem("exam_started");
    window.dispatchEvent(new Event("examStartedChanged"));
    next();
  },
  beforeUnmount() {
    document.removeEventListener("contextmenu", this.disableContextMenu);
    if (this.role === "student" && window.examApp?.exitExamMode) {
      window.examApp.exitExamMode();
    }
  },
  created() {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      api
        .get("/api/admin/decode", {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          let result = res.data;

          if (result.success) {
            api
              .get("/api/admin/" + result.decodedToken.adminId)
              .then((response) => {
                this.admin = response.data.result;
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .get("/api/testOne/" + this.id)
        .then((res) => {
          this.testOne = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });

      this.loadAllResults();
    }
    const url =
      this.role === "student"
        ? `/api/test/byCode/${this.id}`
        : `/api/test/byId/${this.id}`;

    api.get(url).then((res) => {
      this.test = res.data.data;
      this.testRealId = this.test._id;
    });
    this.getTestQuestions();
  },
  computed: {
    isAdmin() {
      if (this.admin) {
        return this.admin.role === "admin";
      }
    },
    isTeaAd() {
      if (this.admin) {
        return ["admin", "teacher"].includes(this.admin.role);
      }
    },
    isJunTeaAd() {
      if (this.admin) {
        return ["admin", "teacher", "junior-teacher"].includes(this.admin.role);
      }
    },
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
p {
  display: flex;
  align-items: center;
}
.timer-fixed {
  position: fixed;
  top: 20px;
  right: 10px;
  z-index: 9999;
  width: max-content;
  max-width: 90vw;
  margin: 0;
}
.table-wrap {
  max-height: 70vh;
  position: relative;
}
.table-x {
  width: 100%;
  overflow-x: auto;
}
.table-sticky {
  min-width: 1200px;
  border-collapse: separate;
  border-spacing: 0;
}

.table-sticky thead th {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
}

.table-sticky tr.student-row.is-open > th,
.table-sticky tr.student-row.is-open > td {
  position: sticky;
  top: 42px;
  z-index: 40;
  background: #fff;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
}

.student-row {
  scroll-margin-top: 60px;
}

.detail-scroll {
  max-height: 55vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  border-radius: 10px;
  background: #f8f9fa;
}

@media (max-width: 1200px) {
  .table-sticky tr.student-row.is-open > th,
  .table-sticky tr.student-row.is-open > td {
    top: 48px;
  }
}
.active {
  display: block !important;
}
</style>
