<template>
  <div class="container">
    <!-- header -->
    <div class="header">
      <h1 class="bg-slate-200 p-3 rounded-lg poppins-regular">
        Welcome to SarrMal, make your life style healthy!
      </h1>
      <div
        class="flex w-full items-center justify-between px-2 md:px-4 py-8 mb-24"
      >
        <!-- Optionally show user info -->
        <div
          v-if="user"
          class="poppins-semibold text-slate-700 text-xl md:text-2xl"
        >
          <p>Are you happy?</p>
        </div>
        <!-- back button  -->
        <router-link to="/meals/confirmed">
          <p
            class="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg poppins-regular"
          >
            Back
          </p>
        </router-link>
      </div>
    </div>
    <!-- end of header  -->

    <!-- rest of buttons start  -->
    <div class="flex items-center justify-center mb-10 gap-6">
        <button @click="refreshPage" class="text-slate-700 bg-slate-200 px-6 py-4 rounded-lg text-xl">
          Refresh
        </button>
        <button @click="confirm" class="text-slate-50 bg-sky-700 px-6 py-4 rounded-lg text-xl">
          Confirm Sets
        </button>
    </div>
    <!-- end of the rest of buttons  -->

    <!-- meal sets  -->
    <!-- food recommendation section  -->
    <h1 class="text-xl text-slate-700 poppins-semibold mb-6">
      Generated Meal Sets
    </h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 p-3 md:p-10"
    >
      <!-- Loop through temp_foods array to display food items -->
      <div
        v-for="food in temp_foods"
        :key="food._id"
        class="flex flex-col items-center p-4 border rounded-md shadow-md bg-white"
      >
        <img
          :src="food.image_url"
          :alt="food.name"
          class="w-full h-32 object-cover mb-2 rounded-md"
        />
        <p class="font-semibold text-lg">{{ food.name }}</p>
        <p class="text-gray-600">Calories: {{ food.calories }} g</p>
      </div>
    </div>
    <!-- end of food recommendation section  -->  

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
      await this.getMeals();
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

    // this function will give 4 meals by random
    async getMeals() {
      try {
        const token = localStorage.getItem("authToken");
        // Fetch user data
        const response = await axiosInstance.get("temp/food/get/temp_foods", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        // Loop through the object keys and push values into temp_foods
        this.temp_foods = response.data;
        this.temp_foods = this.temp_foods["data"];
        // Convert object to an array of [key, value] pairs
        this.temp_foods = Object.entries(this.temp_foods);
        // Convert the sliced array back to an object
        this.temp_foods = Object.fromEntries(this.temp_foods);
        console.log(this.temp_foods);
      } catch (error) {
        this.HandleError(error);
      }
    },

    // error handling function
    HandleError(error) {
      if (error.response) {
        // Check for specific status codes
        if (error.response.status === 401) {
          // Handle 401 Unauthorized error
          console.error("Login failed: Incorrect username or password.");
          this.error = "Login failed: Incorrect username or password.";
        } else if (error.response.status === 404) {
          // Handle 404 Not Found error
          console.error("The requested resource was not found.");
          this.error =
            "The requested resource was not found. Please check the URL.";
        } else {
          // Handle other error responses from the server
          console.error("Error Response:", error.response.data);
          this.error =
            error.response.data.detail ||
            "An error occurred. Please try again.";
        }
      } else if (error.request) {
        // Handle network errors
        console.error("Network Error:", error.request);
        this.error = "Network error. Please check your connection.";
      } else {
        // Handle unexpected errors
        console.error("Error:", error.message);
        this.error = error.message || "An unexpected error occurred.";
      }
    },

    // before route enter
    beforeRouteEnter(to, from, next) {
      if (from.name === "MainPage") {
        // Refresh the page when navigating from the main page
        next((vm) => vm.fetchData());
      } else {
        next();
      }
    },

    // before route leave
    beforeRouteLeave(to, from, next) {
      if (to.name === "MainPage") {
        // Refresh the page when navigating to the main page
        next((vm) => vm.fetchData());
      } else {
        next();
      }
    },

    // refresh or regenerate the page
    async refreshPage() {
      try {
        // Reload the page
        // window.location.reload();
        // Fetch user data
        const token = localStorage.getItem("authToken");
        const response = await axiosInstance.get("temp/food/get/recommended", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        window.location.reload();
        console.log("generated", response);
      } catch (error) {
        this.HandleError(error);
      }
    },

    // confirm the meal set
    async confirm() {
      console.log("clicked");
      try {
        // Fetch user data
        const token = localStorage.getItem("authToken");
        console.log("token", token);
        const response = await axiosInstance.post(
          "temp/food/confirm",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        // Process the response data
        console.log(response.data);
        this.$router.push("/meals/confirmed");
      } catch (error) {
        this.HandleError(error);
      }
    },
  },
};
</script>
