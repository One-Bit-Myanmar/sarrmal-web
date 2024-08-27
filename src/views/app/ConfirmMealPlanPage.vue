<template>
  <div>
    <!-- header  -->
    <div class="flex">
      <div class="flex-1">Header</div>
      <router-link to="/main">back</router-link>
    </div>

    <!-- meal sets  -->
    <!-- food recommendation section  -->
    <h1>Your Meal Plans</h1>
    <div class="grid">
      <!-- Loop through temp_foods array to display food items -->
      <div class="flex" v-for="food in temp_foods" :key="food._id">
        <div class="item" v-if="food.status == 0">
          <!-- tick button  -->
          <button
            @click="tick(food._id)"
            v-if="food.status !== 1 && food.status == 0"
          >
            +
          </button>
          <img :src="food.image_url" :alt="food.name" />
          <p>Name: {{ food.name }}</p>
          <p>Calories: {{ food.calories }} g</p>
        </div>
      </div>
    </div>
    <!-- end of food recommendation section  -->

    <!-- refresh button start  -->
    <button > <router-link to="/meals/generating"> Get new meal set</router-link> </button>
    <!-- end of refresh button  -->
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
        const response = await axiosInstance.get("food/get/confirmed", {
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
