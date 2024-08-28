<template>
  <div class="container h-screen flex flex-col">
    <!-- Error Message Box -->
    <div
      v-if="showError"
      class="bg-red-200 poppins-regular text-red-700 p-4 rounded-md mb-4"
    >
      {{ errorMessage }}
    </div>

    <!-- header -->
    <div class="header">
      <h1 class="bg-slate-200 p-3 rounded-lg poppins-regular">
        Welcome to SarrMal, make your life style healthy!
      </h1>
      <div
        class="flex w-full items-center justify-between px-2 md:px-4 py-8 mb-24"
      >
        <!-- Optionally show user info -->
        <div class="poppins-semibold text-slate-700 text-xl md:text-2xl">
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

    <!-- preferred food option -->
    <div
      class="flex flex-col mb-10 text-center items-center justify-center poppins-regular"
    >
      <div class="w-full md:w-1/2">
        <h1 class="text-slate-700 text-lg capitalize mb-4 poppins-semibold">
          choose your preferred meals
        </h1>
        <select
          name=""
          v-model="preferredFood"
          id=""
          class="w-full px-4 py-2 rounded-lg shadow"
        >
          <option value="" disabled selected>Choose</option>
          <option value="burmese">Burmese</option>
          <option value="chinese">Chinese</option>
          <option value="japanese">Japanese</option>
          <option value="indian">Indian</option>
          <option value="Western">Western</option>
          <option value="Korean">Korean</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Indonesian">Indonesian</option>
          <option value="Malay">Malay</option>
          <option value="Filipino">Filipino</option>
          <option value="Mexican">Mexican</option>
          <option value="French">French</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    <!--  food type option -->
    <div
      class="flex flex-col text-center items-center justify-center mb-10 poppins-regular"
    >
      <div class="w-full md:w-1/2">
        <h1 class="text-slate-700 text-lg capitalize mb-4 poppins-semibold">
          choose what type of food you want
        </h1>
        <select
          v-model="foodType"
          name=""
          id=""
          class="w-full px-4 py-2 rounded-lg shadow"
        >
          <option value="" disabled selected>Choose</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Healthy">Healthy</option>
          <option value="Gym Rat">Gym Rat</option>
          <option value="High-Calorie">High-Calorie</option>
          <option value="High-Fibre">High-Fibre</option>
          <option value="Low-sugar">Low-sugar</option>
          <option value="High-Protein">High-Protein</option>
          <option value="Balanced">Balanced</option>
          <option value="Others">Others</option>
        </select>
      </div>
    </div>

    <!-- rest of buttons start  -->
    <div class="flex items-center justify-center mb-10 gap-6">
      <button
        @click="refreshPage"
        class="text-slate-700 bg-slate-200 px-6 py-4 rounded-lg text-xl"
      >
        <i v-if="isgenerating" class="bx bx-loader-alt animate-spin mr-2"></i>
        <span v-if="isgenerating">Generating...</span>
        <span v-else>Generate</span>
      </button>
      <button
        @click="confirm"
        class="text-slate-50 bg-sky-700 px-6 py-4 rounded-lg text-xl"
      >
        <i v-if="isconfirming" class="bx bx-loader-alt animate-spin mr-2"></i>
        <span v-if="isconfirming">Confirming...</span>
        <span v-else>Confirm Now</span>
      </button>
    </div>
    <!-- end of the rest of buttons  -->

    <!-- meal sets  -->
    <!-- food recommendation section  -->
    <h1 class="text-xl text-slate-700 poppins-semibold mb-6">
      Generated Meal Sets
    </h1>

    <!-- Loading Page -->
    <LoadingPage v-if="loading" />

    <!-- Error Page -->
    <ErrorPage v-if="error" :message="errorMessage" />

    <div v-if="!loading">
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
    </div>
    <!-- end of food recommendation section  -->
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup
import LoadingPage from "@/components/LoadingPage.vue";
import ErrorPage from "@/components/ErrorPage.vue";

export default {
  name: "MealPlanPage",
  components: {
    LoadingPage,
    ErrorPage,
  },
  data() {
    return {
      isLoggedIn: false,
      user: null,
      temp_foods: null,
      loading: true,
      error: false,
      showError: false,
      errorMessage: "",
      isgenerating: false,
      isconfirming: false,
    };
  },

  async created() {
    // Check if user is logged in when the component is created
    await this.checkAuthentication();
  },

  async mounted() {
    // Fetch meals if the user is logged in
    if (this.isLoggedIn) {
      try {
        await this.getMeals();
      } catch (error) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    } else {
      this.loading = false;
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
      // Check if both dropdowns have values selected
      if (!this.preferredFood || !this.foodType) {
        this.showErrorMessage(
          "Please choose both preferred food and food type."
        );
      } else {
        this.isgenerating = true;
        this.loading = true;
        this.error = false;
        try {
          // Reload the page
          // window.location.reload();
          // Fetch user data
          const token = localStorage.getItem("authToken");
          const response = await axiosInstance.get(
            "temp/food/get/recommended",
            {
              params: {
                preferred_food: this.preferredFood,
                food_type: this.foodType,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("generated", response.data);
          this.isgenerating = false;
          this.loading = false;
        } catch (error) {
          this.HandleError(error);
          this.isgenerating = false;
          this.loading = false;
        }
      }
    },

    // show message box
    showErrorMessage(message) {
      this.errorMessage = message;
      this.showError = true;

      // Hide the error message after 5 seconds
      setTimeout(() => {
        this.showError = false;
      }, 5000);
    },

    // confirm the meal set
    async confirm() {
      console.log("clicked");
      try {
        this.isconfirming = true;
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
          }
        );
        // Process the response data
        console.log(response.data);
        this.$router.push("/meals/confirmed");
      } catch (error) {
        this.isconfirming = false;
        this.HandleError(error);
      }
    },
  },
};
</script>
