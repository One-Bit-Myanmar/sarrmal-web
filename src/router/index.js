import WelcomePage from "@/views/WelcomePage.vue";
import { createRouter, createWebHistory } from "vue-router";
// auth form
import LoginPage from "@/views/auth/LoginPage.vue";
import RegisterPage from "@/views/auth/RegisterPage.vue";
// main form and its related page
import ConfirmMealPlanPage from "@/views/app/ConfirmMealPlanPage.vue";
import ConsultAiPage from "@/views/app/ConsultAiPage.vue";
import MainPage from "@/views/app/MainPage.vue";
import MealDetailPage from "@/views/app/MealDetailPage.vue";
import MealPlanPage from "@/views/app/MealPlanPage.vue";
import PhotoTakePage from "@/views/app/PhotoTakePage.vue";
import SettingPage from "@/views/app/SettingPage.vue";

const routes = [
  {
    path: "/",
    name: "welcome",
    component: WelcomePage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/main",
    name: "main",
    component: MainPage,
    meta: { requiresAuth: true }, // Add a meta field to mark this route as requiring authentication
  },
  {
    path: "/meals/generating",
    name: "meals",
    component: MealPlanPage,
    meta: { requiresAuth: true }, // Add a meta field to mark this route as requiring authentication
  },
  {
    path: "/meals/confirmed",
    name: "confirmed_meals",
    component: ConfirmMealPlanPage,
    meta: { requiresAuth: true }, // Add a meta field to mark this route as requiring authentication
  },
  {
    path: "/chat",
    name: "chat",
    component: ConsultAiPage,
    meta: { requiresAuth: true }, // Add a meta field to mark this route as requiring authentication
  },
  {
    path: "/analyze",
    name: "analyze",
    component: PhotoTakePage,
    meta: { requiresAuth: true }, // Add a meta field to mark this route as requiring authentication
  },
  {
    path: "/setting",
    name: "setting",
    component: SettingPage,
    meta: { requiresAuth: true }, // Add a meta field to mark this route as requiring authentication
  },
  {
    path: "/detail",
    name: "detail",
    component: MealDetailPage,
    meta: { requiresAuth: true }, // Add a meta field to mark this route as requiring authentication
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // If route requires authentication
    if (token) {
      // Token exists
      next();
    } else {
      // Token does not exist, redirect to login
      next("/login");
    }
  } else {
    // Route does not require authentication
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (from.name === "MainPage" && to.name === "MainPage") {
    // If navigating from and to the main page, refresh the page
    window.location.reload();
  }
  next();
});

export default router;
