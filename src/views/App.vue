<template>
  <div
    style="height: 100vh"
    class="flex items-center justify-center bg-slate-100"
  >
    <!-- application header  -->
    <!-- <div class="header">
      <h2>Welcome to Sarrmal</h2>
    </div> -->

    <router-view></router-view>
    <!-- before login and register -->
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Make sure to import axiosInstance or configure as needed

export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
      user: null,
    };
  },
  created() {
    // Check if the user is logged in when the component is created
    this.checkAuthentication();
  },
  methods: {
    async checkAuthentication() {
      // Implement your logic to check if the user is logged in
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
/* Add some styles here */
</style>
