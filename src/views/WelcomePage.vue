<template>
  <div class="col-12 flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center gap-8 md:flex-row">
      <h1 class="text-6xl poppins-semibold mb-4 ms-6 md:ms-0">
        SarrMal <br />
        <span class="text-3xl">(The Nutritionist)</span>
      </h1>
      <img :src="logo" alt="" class="w-64 md:w-56 me-6 md:me-0 mb-2" />
    </div>
    <p class="text-2xl poppins-regular text-slate-700 text-center px-6">
      AI Food Recommendation for <b>Diabetes </b>
    </p>

    <div v-if="!isLoggedIn" class="before-login-and-register mt-10">
      <p class="flex items-center justify-center gap-8">
        <router-link
          to="/login"
          class="px-6 py-3 bg-sky-700 rounded-lg text-slate-100 poppins-regular"
          >Login</router-link
        >
        <router-link
          to="/register"
          class="px-6 py-3 bg-slate-200 rounded-lg text-sky-700 border-slate-400 poppins-regular"
          >Register</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axios";

export default {
  name: "WelcomePage",
  data() {
    return {
      logo: require("@/assets/logo.png"),
      isLoggedIn: false,
      user: null,
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    async checkAuthentication() {
      const token = localStorage.getItem("authToken");
      if (token) {
        this.isLoggedIn = true;
        try {
          const response = await axiosInstance.get("user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.user = response.data;
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          this.isLoggedIn = false;
        }
      } else {
        this.isLoggedIn = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add styles here */
</style>
