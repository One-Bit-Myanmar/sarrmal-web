<template>
    <div class="container">
        <!-- header -->
        <div class="header">
            <h1 class="bg-slate-200 p-3 rounded-lg poppins-regular">
                Welcome to SarrMal, make your life style healthy!
            </h1>
            <div class="flex w-full items-center justify-between px-2 md:px-4 py-8 mb-24">
                <!-- Optionally show user info -->
                <div class="poppins-semibold text-slate-700 text-xl md:text-2xl">
                    <p>Personalize your profile</p>
                </div>
                <!-- back button  -->
                <router-link to="/meals/confirmed">
                    <p class="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg poppins-regular">
                        Back
                    </p>
                </router-link>
            </div>
        </div>
        <!-- end of header  -->

        <div class="container">
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-slate-700 poppins-semibold">Profile</h1>
                <div class=""></div>
            </div>
        </div>

    </div>

</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup

export default {
    name: "MealPlanPage",
  data() {
    return {
      isLoggedIn: false,
      user: null,
      temp_foods: null,
    };
  },

  async created() {
    // Check if user is logged in when the component is created
    await this.checkAuthentication();
    if (this.isLoggedIn) {
        // do the rest of the work 
    //   await this.getMeals();
    }
  },


  methods: {
    // this will work first when page is ready

    // this will check authentication method
    async checkAuthentication() {
      // Check if there is a token in localStorage
      const token = localStorage.getItem("authToken");
      if (token) {
        this.isLoggedIn = true;
        try {
          // Fetch user data
          const response = await axiosInstance.get("user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.user = response.data; // Set the user data
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          this.isLoggedIn = false; // Set logged in status to false if fetching fails
          this.$router.push("/login");
        }
      } else {
        this.isLoggedIn = false; // No token means not logged in
        this.$router.push("/login");
      }
    },
    }
}

</script>