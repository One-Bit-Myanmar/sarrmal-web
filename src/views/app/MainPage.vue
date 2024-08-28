<template>
  <div class="container">
    <!-- header -->
    <div class="header">
      <h1 class="bg-slate-200 p-3 rounded-lg poppins-regular">
        Welcome to SarrMal, make your life style healthy!
      </h1>
      <div class="flex w-full items-center justify-between px-2 md:px-4 py-8 mb-24 ">
        <!-- Optionally show user info -->
        <div v-if="user" class="poppins-semibold text-slate-700 text-xl md:text-2xl">
          <p>
            Welcome, <span class="text-sky-700">{{ user.username }}</span>
          </p>
        </div>

        <!-- hambuger button  -->
        <div class="relative">
          <!-- Hamburger Icon -->
          <button @click="toggleMenu" class="p-2 rounded-md focus:outline-none">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isMenuOpen"
            class="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-md border border-gray-200 p-4"
          >
            <ul class="flex flex-col">
              <li>
                <button
                  @click="chatWithAI"
                  class="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Chat with AI
                </button>
              </li>
              <li>
                <button
                  @click="analyzePhoto"
                  class="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Calculate Calories
                </button>
              </li>
              <li>
                <button
                  v-if="isLoggedIn"
                  @click="openSettings"
                  class="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Settings
                </button>
              </li>
              <li>
                <button
                  @click="logout"
                  v-if="isLoggedIn"
                  class="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- end of header  -->

    <!-- rest of buttons start  -->
    <div class="flex items-center justify-center mb-10">
      <router-link to="/meals/confirmed">
        <p class="text-slate-50 bg-sky-700 px-6 py-4 rounded-lg text-xl">
          Personalize Your Meal Plan
        </p>
      </router-link>
    </div>
    <!-- end of the rest of buttons  -->

    <!-- food recommendation section  -->
    <h1 class="text-xl text-slate-700 poppins-semibold mb-6">Recommended Meals</h1>
    <div class="grid grid-cols-2 gap-4 p-3 md:p-10">
      <!-- Loop through temp_foods array to display food items -->
      <div
        v-for="food in temp_foods"
        :key="food._id"
        class="flex flex-col items-center p-4 border rounded-md shadow-md"
      >
        <img
          :src="food.image_url"
          :alt="food.name"
          class="w-full h-32 object-cover mb-2"
        />
        <p class="font-semibold">{{ food.name }}</p>
        <p>Calories: {{ food.calories }} g</p>
      </div>
    </div>
    <!-- end of food recommendation section  -->

    
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup

export default {
  name: "MainPage",
  data() {
    return {
      isLoggedIn: false,
      user: null,
      temp_foods: null,
      isMenuOpen: false,
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
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

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
        // Slice the array to get the first 4 entries
        this.temp_foods = this.temp_foods.slice(0, 4);
        // Convert the sliced array back to an object
        this.temp_foods = Object.fromEntries(this.temp_foods);
        console.log(this.temp_foods);
      } catch (error) {
        this.HandleError(error);
      }
    },

    // logout method
    logout() {
      // Check if there is a token in localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        // Handle the case where there is no token
        console.error("No authentication token found.");
        this.$router.push("/login");
        return;
      }
      // Assuming you have a logout endpoint on your server
      axiosInstance
        .put(
          "user/logout",
          {},
          {
            // Empty body since it's a logout request
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Remove token and update UI
          localStorage.removeItem("authToken");
          this.isLoggedIn = false;
          this.user = null;
          // Redirect to login page
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Failed to logout:", error);
          // Optionally handle logout errors here
          this.$router.push("/login"); // Redirect even if there is an error
        });
    },

    // open setting or profile
    openSettings() {
      // Handle settings logic here
      console.log('Settings clicked');
    },

    // chat with ai route
    chatWithAI() {
      // Handle chat with AI logic here
      this.$router.push('/chat')
    },

    // analyze photo route
    analyzePhoto() {
      // Handle photo analysis logic here
      this.$router.push('/analyze')
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
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
