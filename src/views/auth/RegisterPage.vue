<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="handleSubmit">
      <!-- Section 1: Email and Password -->
      <div v-if="!isSection2Visible" class="group-1">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div>
          <label for="confirm_password">Confirm Password:</label>
          <input
            type="password"
            id="confirm_password"
            v-model="confirm_password"
            required
          />
        </div>
      </div>
      <button
        v-if="!isSection2Visible"
        :disabled="!isEmailAndPasswordValid"
        @click="showSection2"
      >
        Next
      </button>

      <!-- Section 2: Additional Information -->
      <div v-if="isSection2Visible" class="group-2">
        <div>
          <label for="name">Username:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div>
          <label for="age">age:</label>
          <input type="number" id="age" v-model="age" required />
        </div>
        <div>
          <label for="gender">Gender:</label>
          <select id="gender" v-model="gender" required>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>
        <div style="display: flex">
          <div>
            <label for="weight">Weight (kg)</label>
            <input type="number" id="weight" v-model="weight" required />
          </div>
          <div>
            <label for="height">Height (cm)</label>
            <input type="number" id="height" v-model="height" required />
          </div>
        </div>
        <div>
          <label for="diseases">Disease:</label>
          <input type="text" id="diseases" v-model="diseases" required />
        </div>
        <div>
          <label for="allergies">Allergies:</label>
          <input type="text" id="allergies" v-model="allergies" required />
        </div>
        <div>
          <label for="exercies">Exercise:</label>
          <select id="exercise" v-model="exercise" required>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <button v-if="isSection2Visible" type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import path as needed

export default {
  // data
  data() {
    return {
      name: "",
      email: "",
      password: "",
      age: "",
      confirm_password: "",
      gender: "",
      weight: "",
      height: "",
      diseases: "",
      allergies: "",
      exercise: "",
      error: null,
      isSection2Visible: false, // Controls visibility of the second section
    };
  },

  computed: {
    // Check if email and password fields are valid
    isEmailAndPasswordValid() {
      return (
        this.email &&
        this.password &&
        this.confirm_password &&
        this.password === this.confirm_password
      );
    },
  },
  methods: {
    // Show the second section of the form
    showSection2() {
      if (this.isEmailAndPasswordValid) {
        this.isSection2Visible = true;
      } else {
        this.error =
          "Please ensure that email, password, and confirmation are valid.";
      }
    },

    async handleSubmit() {
      // Clear any previous error message
      this.error = null;

      // Check if all required fields in section 2 are filled
      if (
        !this.name ||
        !this.gender ||
        !this.weight ||
        !this.height ||
        !this.diseases ||
        !this.allergies ||
        !this.exercise ||
        !this.age
      ) {
        this.error = "Please fill in all required fields.";
        return;
      }

      // Convert comma-separated values to arrays
      const diseasesArray = this.diseases
        .split(",")
        .map((disease) => disease.trim());
      const allergiesArray = this.allergies
        .split(",")
        .map((allergy) => allergy.trim());

      try {
        // Register new user
        const response = await axiosInstance.post("user/register", {
          username: this.name,
          email: this.email,
          password: this.password,
          gender: parseInt(this.gender),
          weight: parseFloat(this.weight),
          height: parseFloat(this.height),
          diseases: diseasesArray,
          allergies: allergiesArray,
          exercises: this.exercise,
          disabled: false,
          age: parseInt(this.age),
        });
        // store in localstorage or session
        localStorage.setItem("authToken", response.data.access_token); // Adjust according to your response structure
        localStorage.setItem("tokenType", response.data.token_type); // Adjust according to your response structure
        // if success then go to main route
        this.$router.push("/main");
      } catch (error) {
        // Handle registration error
        this.HandleError(error);
      }
    },

    // error handling function
    HandleError(error) {
      if (error.response && error.response.status === 401) {
        // Handle 401 Unauthorized error
        console.error("Login failed: Incorrect username or password.");
      } else if (error.response) {
        // Handle other error responses from the server
        console.error("Error Response:", error.response.data);
        this.error = error.response.data.detail;
      } else {
        // Handle network or unexpected errors
        console.error("Error:", error.message);
        this.error = error.message;
      }
    },
    
  },
};
</script>

<style scoped>
/* Add some styles here */
</style>
