<template>
  <div class="container h-screen flex flex-col">
    <!-- header -->
    <div class="header">
      <h1 class="bg-slate-200 p-3 rounded-lg poppins-regular">
        Welcome to SarrMal, make your lifestyle healthy!
      </h1>
      <div
        class="flex w-full items-center justify-between px-2 md:px-4 py-8 mb-24"
      >
        <!-- Optionally show user info -->
        <div class="poppins-semibold text-slate-700 text-xl md:text-2xl">
          <p>Your Meal History</p>
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

    <!-- main section  -->
    <!-- Loading Page -->
    <LoadingPage v-if="loading" />

    <!-- Error Page -->
    <ErrorPage v-if="error" :message="errorMessage" />

    <div v-else>
      <div v-for="(foods, date) in groupedData" :key="date" class="mb-8">
        <h2 class="text-lg font-semibold mb-2">{{ date }}</h2>
        <div class="grid grid-cols-2 gap-4 p-3 md:p-10">
          <div
            v-for="food in foods"
            :key="food._id"
            class="flex flex-col items-center p-4 border rounded-md shadow-md"
          >
            <img
              :src="food.foodDetails.data.image_url"
              :alt="food.foodDetails.data.name"
              class="w-full h-32 object-cover mb-2"
            />
            <router-link
              :to="{
                name: 'detail',
                params: {
                  food_id: food.foodDetails.data._id,
                  where: 'fix_food',
                },
              }"
            >
              <p class="font-semibold">{{ food.foodDetails.data.name }}</p>
            </router-link>
            <p>Calories: {{ food.foodDetails.data.calories }} g</p>
            <!-- Add other food details as needed -->
          </div>
        </div>
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
      temp_foods: [], // Array to hold flattened and enriched data
      loading: true,
      error: false,
      food_ids: [],
      rawData: null, // The original data from the API
      groupedData: {}, // The grouped data by created_at
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
        await this.get_meal_history();
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
          this.user = response.data; // Set the user data
          console.log(this.user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          this.isLoggedIn = false;
          this.$router.push("/login");
        }
      } else {
        this.isLoggedIn = false;
        this.$router.push("/login");
      }
    },

    async get_meal_history() {
      try {
        const token = localStorage.getItem("authToken");
        // Fetch the meal history data
        const response = await axiosInstance.get("food-history/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.rawData = response.data;
        await this.returnGroupedData();
        console.log(this.groupedData);
      } catch (error) {
        this.HandleError(error);
      }
    },

    async returnGroupedData() {
      const token = localStorage.getItem("authToken");
      const entries = Object.values(this.rawData.data);
      const groupedData = entries.reduce((acc, entry) => {
        if (entry.created_at) {
          const date = entry.created_at.split("T")[0]; // Assuming 'created_at' is in ISO format
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(entry);
        }
        return acc;
      }, {});

      // Fetch food details and update groupedData
      for (const date in groupedData) {
        const foods = await Promise.all(
          groupedData[date].map(async (entry) => {
            try {
              const foodResponse = await axiosInstance.get(
                `food/get/${entry.food_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                ...entry,
                foodDetails: foodResponse.data,
              };
            } catch (error) {
              console.error(
                `Error fetching food with ID ${entry.food_id}:`,
                error
              );
              return entry; // Return the entry without food details if there's an error
            }
          })
        );
        groupedData[date] = foods;
      }

      this.groupedData = groupedData;
      console.log("gp", this.groupedData);
      // Flatten grouped data to update meal history (temp_foods)
      this.temp_foods = Object.values(groupedData).flat();
      console.log("temp foods: ", this.temp_foods);
    },

    HandleError(error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.error("Login failed: Incorrect username or password.");
          this.error = "Login failed: Incorrect username or password.";
        } else if (error.response.status === 404) {
          console.error("The requested resource was not found.");
          this.error =
            "The requested resource was not found. Please check the URL.";
        } else {
          console.error("Error Response:", error.response.data);
          this.error =
            error.response.data.detail ||
            "An error occurred. Please try again.";
        }
      } else if (error.request) {
        console.error("Network Error:", error.request);
        this.error = "Network error. Please check your connection.";
      } else {
        console.error("Error:", error.message);
        this.error = error.message || "An unexpected error occurred.";
      }
    },
  },
};
</script>
