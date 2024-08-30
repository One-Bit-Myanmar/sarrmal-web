<template>
  <div
    class="container flex flex-col bg-yellow-100"
    :class="
      loading || Object.keys(temp_foods).length === 0 ? 'h-screen' : 'h-auto'
    "
  >
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
          Be Happy and Healthy 
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

    <!-- rest of buttons start  -->
    <div class="flex items-center justify-center mb-10">
      <router-link to="/meals/generating">
        <p class="text-slate-50 bg-sky-700 px-6 py-4 rounded-lg text-xl">
          Get new meal set
        </p>
      </router-link>
    </div>
    <!-- end of the rest of buttons  -->

    <!-- meal sets  -->
    <!-- food recommendation section  -->
    <h1 class="text-xl text-slate-700 poppins-semibold mb-6">
      Your Meal Plans
    </h1>

    <!-- Loading Page -->
    <LoadingPage v-if="loading" />

    <!-- Error Page -->
    <ErrorPage v-if="error" :message="errorMessage" />

    <div v-else>
      <!-- if meal is empty  -->
      <!-- check meal plan is empty or not  -->
      <div v-if="count_temp_foods">
        <h2 class=" text-yellow-500 text-center w-full 
         rounded-lg  px-8 py-4 poppins-regular">
          <i class="bx bx-happy text-4xl mt-3"></i> <br>
          <span class="">
            Create Healthy Meal Sets!! <br> Just click <b>"Get new meal set"</b> button
          </span>
        </h2>
      </div>

      <div
        class="grid grid-cols-1 poppins-regular sm:grid-cols-2 md:grid-cols-2 gap-4 p-3 md:p-10"
      >
        <!-- Loop through temp_foods array to display food items -->
        <div
          v-for="food in temp_foods"
          :key="food._id"
          class="flex flex-col items-center p-4 border rounded-md shadow-md bg-white"
        >
          <!-- tick button to tick the taken meal  -->
          <img
            :src="food.image_url"
            :alt="food.name"
            class="w-full h-32 object-cover mb-2 rounded-md"
          />
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col items-start justify-start">
              <router-link
                :to="{
                  name: 'detail',
                  params: {
                    food_id: food._id,
                    where: 'fix_food',
                  },
                }"
              >
                <p class="font-semibold text-lg text-center text-sky-700">
                  {{ food.name }}
                </p>
              </router-link>
              <p class="text-gray-600">Calories: {{ food.calories }} g</p>
            </div>
            <button
              @click="tick(food._id)"
              class="bg-sky-300 text-slate-100 px-2 py-1 rounded-lg"
            >
              <i class="bx bx-check"></i>
            </button>
          </div>
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
      count_temp_foods: null,
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
        await this.getMeals()
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
        const response = await axiosInstance.get("food/get/confirmed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        // Loop through the object keys and push values into temp_foods
        this.temp_foods = response.data;
        this.temp_foods = this.temp_foods["data"];
        if (Object.keys(this.temp_foods).length === 0) {
            console.log("count", this.count_temp_foods);
            this.count_temp_foods = true;
          } else {
            this.count_temp_foods = false;
          }
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

    // Define tickFood as an async method
    async tick(food_id) {
      const token = localStorage.getItem("authToken");

      try {
        // Replace `{}` with the actual food_id in the URL
        const response = await axiosInstance.put(
          `/food/tick/${food_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Emit events on success
          this.$emit("tick_food", food_id);
          this.$emit("update_food", food_id);
        }
        window.location.reload(); // This will reload the current page
      } catch (error) {
        // Handle errors
        this.HandleError(error);
      }
    },
  },
};
</script>
