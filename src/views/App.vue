<template>
  <div
    :class="containerClass"
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

  computed: {
      containerClass() {
        const route = this.$route.path;
        let classes = "flex justify-center bg-slate-50 p-5";

        if (route === '/' || route === '/login' || route === '/register') {
          classes += " items-center h-screen"; // Center align with 100vh
        } else {
          classes += " items-start h-auto"; // Start align with custom height
        }

        return classes;
      },
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
