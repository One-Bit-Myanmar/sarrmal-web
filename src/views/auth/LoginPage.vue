<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="text" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <!-- Error message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <button type="submit">Login</button>
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
    };
  },

  methods: {

    // login method
    async login() {
      // Clear any previous error message
      this.error = null;
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
