<template>
  <div>
    <div v-if="!isLoggedIn" class="before-login-and-register">
      <h1>Welcome to Our Application!</h1>
      <p>
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link>
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
  }
};
</script>

<style scoped>
/* Add styles here */
</style>
