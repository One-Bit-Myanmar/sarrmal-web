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
          <p>Personalize your profile</p>
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

    <div v-if="user" class="flex flex-col items-center justify-center">
      <div
        class="flex items-center poppins-regular flex-col justify-center gap-3 border py-4 px-8 bg-white rounded-lg shadow"
        style="width: 450px"
      >
        <div class="flex items-center justify-between w-full">
          <h1
            class="text-slate-700 mt-5 text-center block poppins-semibold text-2xl mb-6"
          >
            Profile
          </h1>
          <div class="bg-slate-200 rounded-lg px-3 py-2">
            <router-link to="/">
              <i class="bx bx-pencil text-sky-600 text-md font-semibold"></i>
              Edit
            </router-link>
          </div>
        </div>
        <!-- username  -->
        <div
          class="flex flex-col items-center text-center w-full justify-center mb-3"
        >
          <p class="text-sky-700">Username</p>
          <span class="text-slate-700">{{ user.username }}</span>
        </div>
        <!-- email  -->
        <div
          class="flex flex-col items-center text-center w-full justify-center mb-3"
        >
          <p class="text-sky-700">Email</p>
          <span class="text-slate-700">{{ user.email }}</span>
        </div>
        <!-- weight and height -->
        <div class="flex items-center justify-center w-full mb-3">
          <div
            class="flex flex-col items-center text-center w-full justify-center"
          >
            <p class="text-sky-700">Weight</p>
            <span class="text-slate-700">{{ user.weight }} kg</span>
          </div>
          <div
            class="flex flex-col items-center text-center w-full justify-center"
          >
            <p class="text-sky-700">Height</p>
            <span class="text-slate-700">{{ user.height }} cm</span>
          </div>
        </div>
        <!-- disease  -->
        <!-- Diseases -->
        <div
          class="flex flex-col items-center text-center w-full justify-center mb-3"
        >
          <p class="text-sky-700">Diseases</p>

          <!-- Loop through the user.diseases array -->
          <ul class="text-slate-700">
            <li
              v-for="(disease, index) in user.diseases"
              :key="index"
              class="bg-slate-200 rounded-lg p-2"
            >
              {{ disease }}
            </li>
          </ul>
        </div>

        <!-- disease  -->
        <div
          class="flex flex-col items-center text-center w-full justify-center mb-3"
        >
          <p class="text-sky-700">Allergies</p>

          <!-- Loop through the user.diseases array -->
          <ul class="text-slate-700">
            <li
              v-for="(allergie, index) in user.allergies"
              :key="index"
              class="bg-slate-200 rounded-lg p-2"
            >
              {{ allergie }}
            </li>
          </ul>
        </div>
        <!-- exercis  -->
        <div
          class="flex flex-col items-center text-center w-full justify-center mb-3"
        >
          <p class="text-sky-700">Activity</p>
          <span class="text-slate-700">{{ user.exercises }}</span>
        </div>

        <!-- button group  -->
        <div class="flex items-center justify-center gap-6">
          <button
            @click="logout"
            class="px-6 py-2 text-slate-50 bg-yellow-600 rounded-lg shadow text-sm"
          >
            Logout
          </button>
          <button
            @click="deleteAccount"
            class="px-6 py-2 text-slate-50 bg-red-700 rounded-lg shadow text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- else state  -->
    <div v-else class="flex flex-col items-center justify-center h-screen">
      <!-- Loading Page -->
      <LoadingPage />
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup
import LoadingPage from "@/components/LoadingPage.vue";
// import ErrorPage from "@/components/ErrorPage.vue";

export default {
  name: "MealPlanPage",
  components: {
    LoadingPage,
    // ErrorPage,
  },

  data() {
    return {
      isLoggedIn: false,
      user: null,
      temp_foods: null,
      loading: true,
      error: false,
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
        // addition fetching
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
          console.log(this.user);
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

    // logout account
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

    // delete account
    deleteAcount() {
      // Check if there is a token in localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        // Handle the case where there is no token
        console.error("No authentication token found.");
        this.$router.push("/");
        return;
      }
      // Assuming you have a logout endpoint on your server
      axiosInstance
        .put(
          "user/delete",
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
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Failed to logout:", error);
          // Optionally handle logout errors here
          this.$router.push("/login"); // Redirect even if there is an error
        });
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
