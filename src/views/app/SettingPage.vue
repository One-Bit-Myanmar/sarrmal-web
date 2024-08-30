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
          <p>User Information</p>
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
            <button
              @click="toggleEdit"
              class="text-sky-600 text-md font-semibold"
            >
              <i class="bx" :class="isEditing ? 'bx-save' : 'bx-pencil'"></i>
              {{ isEditing ? "Update" : "Edit" }}
            </button>
          </div>
        </div>

        <form action="">
          <!-- Username -->
          <div
            class="flex flex-col items-start text-start w-full justify-center mb-3"
          >
            <p class="text-sky-700">Username</p>
            <input
              type="text"
              class="text-slate-700 w-full bg-slate-200 rounded-lg p-2"
              v-model="user.username"
              :disabled="!isEditing"
            />
          </div>

          <!-- Email -->
          <div
            class="flex flex-col items-start text-start w-full justify-center mb-3"
          >
            <p class="text-sky-700">Email</p>
            <input
              type="text"
              class="text-slate-700 w-full bg-slate-200 rounded-lg p-2"
              v-model="user.email"
              :disabled="!isEditing"
            />
          </div>

          <!-- age -->
          <div
            class="flex flex-col items-start text-start w-full justify-center mb-3"
          >
            <p class="text-sky-700">Age</p>
            <input
              type="number"
              class="text-slate-700 w-full bg-slate-200 rounded-lg p-2"
              v-model="user.age"
              :disabled="!isEditing"
            />
          </div>

          <!-- Weight and Height -->
          <div class="flex items-center justify-center gap-3 w-full mb-3">
            <div
              class="flex flex-col items-start text-start w-full justify-center"
            >
              <p class="text-sky-700">Weight (kg)</p>
              <input
                type="number"
                class="text-slate-700 w-full bg-slate-200 rounded-lg p-2"
                v-model="user.weight"
                :disabled="!isEditing"
              />
            </div>
            <div
              class="flex flex-col items-center text-center w-full justify-center"
            >
              <p class="text-sky-700">Height (cm)</p>
              <input
                type="number"
                class="text-slate-700 w-full bg-slate-200 rounded-lg p-2"
                v-model="user.height"
                :disabled="!isEditing"
              />
            </div>
          </div>

          <!-- Diseases -->
          <div
            class="flex flex-col items-start text-start w-full justify-center mb-3"
          >
            <p class="text-sky-700">Diseases</p>
            <ul class="text-slate-700 flex items-start gap-3">
              <li
                v-for="(disease, index) in user.diseases"
                :key="index"
                class="bg-slate-200 rounded-lg p-2"
              >
                {{ disease }}
              </li>
            </ul>
          </div>

          <!-- Allergies -->
          <div
            class="flex flex-col items-start text-start w-full justify-center mb-3"
          >
            <p class="text-sky-700">Allergies</p>
            <ul class="text-slate-700 flex items-start gap-3">
              <li
                v-for="(allergie, index) in user.allergies"
                :key="index"
                class="bg-slate-200 rounded-lg p-2"
              >
                {{ allergie }}
              </li>
            </ul>
          </div>

          <!-- Activity -->
          <div
            class="flex flex-col items-start text-start w-full justify-center mb-3"
          >
            <p class="text-sky-700">Activity</p>
            <select
              name="exercises"
              class="text-slate-700 bg-slate-200 rounded-lg p-2 w-full"
              v-model="user.exercises"
              :disabled="!isEditing"
            >
              <option value="">Choose</option>
              <option :value="'light'" :selected="user.exercises === 'light'">
                Light
              </option>
              <option
                :value="'moderate'"
                :selected="user.exercises === 'moderate'"
              >
                Moderate
              </option>
              <option :value="'active'" :selected="user.exercises === 'active'">
                Active
              </option>
            </select>
          </div>
        </form>

        <!-- Button Group -->
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
      username: "",
      email: "",
      weight: "",
      height: "",
      diseases: [],
      allergies: [],
      activity: "",
      isEditing: false,
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

    toggleEdit() {
      if (this.isEditing) {
        // Save the changes
        // this.updateUserProfile();
      }
      this.isEditing = !this.isEditing;
    },

    async updateUserProfile() {
      try {
        const token = localStorage.getItem("authToken");
        await axiosInstance.put(
          "user/update",
          {
            name: this.name,
            email: this.email,
            age: this.age,
            weight: this.weight,
            height: this.height,
            exercises: this.exercises,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile");
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
  },
};
</script>
