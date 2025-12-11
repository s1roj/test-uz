import { createRouter, createWebHistory } from "vue-router";
import DefaultPage from "../layouts/default.vue";
import Login from "../layouts/login.vue";
import NotFound from "../layouts/404.vue";
import Home from "../views/Index.vue";
import Test from "../views/test.vue";
import Result from "../views/result.vue";

const routes = [
  {
    path: "/",
    component: DefaultPage,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: { auth: true },
      },
      {
        path: "/test/:id",
        name: "test",
        component: Test,
        meta: { auth: true },
      },
      {
        path: "/result/:id",
        name: "result",
        component: Result,
        meta: { auth: true },
      },
      {
        path: "/admin",
        name: "admin",
        component: () => import("../views/admin.vue"),
        meta: { auth: true, role: "admin" },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const reqAut = to.meta.auth;
  const token = localStorage.getItem("token");

  if (reqAut && token) {
    if (to.name == "login") {
      next({ name: "home" });
      return;
    }

    next();
    return;
  }

  if (token) {
    if (to.name == "login") {
      next({ name: "home" });
      return;
    }
  } else {
    if (to.name != "login") {
      next({ name: "login" });
      return;
    }
  }

  next();
});

export default router;
