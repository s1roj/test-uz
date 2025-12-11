<template>
  <div class="container mt-4 position-relative">
    <router-link
      to="/"
      type="button"
      class="btn-close position-absolute top-0 end-0"
      aria-label="Close"
    ></router-link>
    <h2 class="text-center mb-4">Admin boshqaruv paneli</h2>
    <!-- REGISTER FORM -->
    <div class="card p-4 mb-4 shadow-sm">
      <h4>Yangi admin qo‘shish</h4>

      <div class="mt-3">
        <input
          v-model="form.name"
          class="form-control mb-2"
          placeholder="Ism"
        />
        <input
          v-model="form.phone"
          class="form-control mb-2"
          placeholder="Telefon (raqam)"
        />
        <input
          v-model="form.password"
          class="form-control mb-2"
          placeholder="Parol"
        />

        <select v-model="form.role" class="form-control mb-3">
          <option value="admin">Admin</option>
          <option value="teacher">O‘qituvchi</option>
        </select>

        <button class="btn btn-success" @click="register">
          Ro‘yxatdan o‘tkazish
        </button>
      </div>
    </div>
    <div>
      <button class="btn btn-danger mb-3" @click="deleteAllStudents">
        Barcha talabalarni o‘chirish
      </button>
    </div>
    <!-- LIST -->
    <div class="card p-4 shadow-sm">
      <h4>Adminlar ro‘yxati</h4>

      <table class="table table-bordered mt-3">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Ism</th>
            <th>Telefon</th>
            <th>Role</th>
            <th>O‘chirish</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(a, index) in admins" :key="a._id">
            <td>{{ index + 1 }}</td>
            <td>{{ a.name }}</td>
            <td>{{ a.phone }}</td>
            <td>{{ a.role }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="deleteAdmin(a._id)">
                O‘chirish
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="admins.length === 0" class="text-muted">
        Hozircha adminlar yo‘q...
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      admins: [],

      form: {
        name: "",
        phone: "",
        password: "",
        role: "teacher",
      },
    };
  },

  methods: {
    async getAllAdmins() {
      try {
        const res = await this.axios.get("http://10.1.100.230:3000/api/admin/all");
        this.admins = res.data.result;
      } catch (err) {
        console.log("GetAll error:", err);
      }
    },

    async register() {
      try {
        const res = await this.axios.post(
          "http://10.1.100.230:3000/api/admin/register",
          this.form
        );

        if (res.data.success) {
          alert("Admin muvaffaqiyatli qo‘shildi!");
          this.getAllAdmins();
          window.location.reload();
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        console.log("Register error:", err);
      }
    },

    async deleteAdmin(id) {
      if (!confirm("Adminni o‘chirishni tasdiqlaysizmi?")) return;

      try {
        await this.axios.delete("http://10.1.100.230:3000/api/admin/delete/" + id);

        alert("Admin o‘chirildi!");
        this.getAllAdmins();
      } catch (err) {
        console.log("Delete error:", err);
      }
    },

    deleteAllStudents() {
      if (!confirm("Barcha talabalar VA barcha natijalar o‘chirilsinmi?"))
        return;

      this.axios
        .delete("http://10.1.100.230:3000/api/user/delete/all", {
          data: { role: localStorage.getItem("role") },
        })
        .then((res) => {
          alert(res.data.message);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert("Xatolik yuz berdi!");
        });
    },
  },

  created() {
    this.getAllAdmins();
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>
