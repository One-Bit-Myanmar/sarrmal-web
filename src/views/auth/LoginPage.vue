<template>
  <div class="p-6 bg-slate-50 rounded-lg shadow poppins-regular">
    <h1 class="mb-8 text-xl poppins-semibold text-sky-700">
      <i class="bx bx-key"></i> Login
    </h1>
    <form
      @submit.prevent="login"
      class="flex flex-col items-start justify-center gap-6"
      style="width: 350px"
    >
      <div class="flex flex-col items-start justify-center gap-2 w-full">
        <label for="email">Email</label>
        <input
          type="email"
          class="p-3 w-full shadow"
          id="email"
          v-model="email"
          required
        />
      </div>
      <div class="flex flex-col items-start justify-center gap-2 w-full">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          class="p-3 w-full shadow"
          v-model="password"
          required
        />
      </div>
      <!-- Error message -->
      <div v-if="error" class="error bg-red-200 text-red-700 rounded-lg shadow px-4 py-2">
        {{ error }}
      </div>
      <div class="flex items-center justify-between w-full gap-4">
        <router-link to="/">
          <div
            class="w-full px-8 py-4 bg-slate-200 text-sky-700 poppins-regular rounded-lg"
          >
            Back
          </div>
        </router-link>

        <!-- login button  -->
        <button
          type="submit"
          class="w-full px-8 py-4 bg-sky-700 text-slate-100 poppins-regular rounded-lg"
        >
          <i v-if="loading" class="bx bx-loader-alt animate-spin mr-2"></i>
          <span v-if="loading">Loading...</span>
          <span v-else>Login</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust import if needed

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      error: "",
      loading: false,
    };
  },

  methods: {
    // login method
    async login() {
      // Clear any previous error message
      // Set loading to true when the button is clicked
      this.loading = true;
      this.error = null;
      console.log("clicked");
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append("username", this.email); // Note: OAuth2PasswordRequestForm uses 'username' instead of 'email'
        formData.append("password", this.password);
        // Send the POST request with form data
        const response = await axiosInstance.post("user/login", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        // store in localstorage or session
        localStorage.setItem("authToken", response.data.access_token); // Adjust according to your response structure
        localStorage.setItem("tokenType", response.data.token_type); // Adjust according to your response structure
        // if success then go to main route
        this.$router.push("/main");
      } catch (error) {
        // error handling for unexpected error
        this.loading = false;
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

<style scoped>
/* Add some styles here */
</style>
