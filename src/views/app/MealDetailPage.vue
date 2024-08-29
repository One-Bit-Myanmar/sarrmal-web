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
        <div class="poppins-semibold text-slate-700 text-xl md:text-2xl">
          <p>You curious!</p>
        </div>
        <!-- back button  -->
        <router-link to="/main">
          <p
            class="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg poppins-regular"
          >
            Back
          </p>
        </router-link>
      </div>
    </div>
    <!-- end of header  -->

    <!-- Loading Page -->
    <LoadingPage v-if="loading" />

    <!-- Error Page -->
    <ErrorPage v-if="error" :message="errorMessage" />

    <div
      class="flex flex-col items-center justify-center w-3/2"
      v-if="food_info"
    >
      <!-- Food Image -->
      <img
        :src="food_info.image_url"
        :alt="food_info.name"
        class="w-1/2 md:w-26 h-auto rounded-lg mb-5"
      />

      <h3 class="text-slate-700 poppins-semibold mb-3 text-2xl">
        {{ food_info.name }}
      </h3>

      <div class="flex flex-col items-center justify-center mb-5">
        <p class="mb-2 text-sky-700 capitalize poppins-semibold">
          Calories Amount
        </p>
        <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
          {{ food_info.calories }} Calories
        </p>
      </div>

      <div class="flex flex-col items-center justify-center mb-5">
        <p class="mb-2 text-sky-700 capitalize poppins-semibold">Category</p>
        <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
          {{ food_info.category }}
        </p>
      </div>

      <div class="flex flex-col items-center justify-center mb-5">
        <p class="mb-2 text-sky-700 capitalize poppins-semibold">How to cook</p>
        <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
          {{ food_info.how_to_cook }}
        </p>
      </div>

      <div class="flex flex-col items-center justify-center mb-5">
        <p class="mb-2 text-sky-700 capitalize poppins-semibold">Meal time</p>
        <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
          {{ food_info.meal_time }}
        </p>
      </div>

      <div class="flex flex-col items-center justify-center mb-5">
        <p class="mb-2 text-sky-700 capitalize poppins-semibold">Ingredients</p>
        <ul class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
          <li v-for="(ingredient, index) in food_info.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </div>
    </div>
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
      food_info: null,
      foodID: null,
      loading: true,
      error: false,
      from_where: null,
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
        const food_id = this.$route.params.food_id;
        const where = this.$route.params.where;
        this.foodID = food_id;
        this.from_where = where;
        await this.get_meal_detail();
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

    // get meal detail
    async get_meal_detail() {
      try {
        const token = localStorage.getItem("authToken");
        // Fetch user data
        const response = await axiosInstance.get(
          this.from_where == 'fix_food'
            ? `food/get/${this.foodID}`
            : `temp/food/get/${this.foodID}`,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.food_info = response.data.data;
        this.food_info.ingredients = this.food_info.ingredients
          .split(",")
          .map((item) => item.trim());
        console.log(this.food_info);
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
  },
};
</script>
