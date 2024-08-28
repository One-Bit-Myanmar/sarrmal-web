<template>
  <div class="p-6 bg-light rounded-lg shadow poppins-regular">
    <h1 class="mb-8 text-xl poppins-semibold text-sky-700">Register</h1>
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col items-start justify-center gap-6"
      :class="{
        'w-[350px]': !isSection2Visible,
        'w-[600px]': isSection2Visible,
      }"
    >
      <!-- Section 1: Email and Password -->
      <div
        v-if="!isSection2Visible"
        class="flex flex-col items-start justify-center gap-6 w-full max-w-md mx-auto"
      >
        <div class="flex flex-col items-start justify-center gap-2 w-full">
          <label for="email" class="text-lg font-regular">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="p-3 w-full shadow rounded-md"
          />
        </div>
        <div class="flex flex-col items-start justify-center gap-2 w-full">
          <label for="password" class="text-lg font-regular">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="p-3 w-full shadow rounded-md"
          />
        </div>
        <div class="flex flex-col items-start justify-center gap-2 w-full">
          <label for="confirm_password" class="text-lg font-regular"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirm_password"
            v-model="confirm_password"
            required
            class="p-3 w-full shadow rounded-md"
          />
        </div>

        <div class="flex items-center justify-between w-full gap-4">
          <router-link to="/">
            <div
              class="w-full px-8 py-4 bg-slate-200 text-sky-700 poppins-regular rounded-lg"
            >
              Back
            </div>
          </router-link>
          <button
            v-if="!isSection2Visible"
            :disabled="!isEmailAndPasswordValid"
            @click="showSection2"
            :class="{
              'w-full px-8 py-4 rounded-lg font-semibold': true,
              'bg-sky-400 text-slate-100': !isEmailAndPasswordValid,
              'bg-sky-700 text-slate-100': isEmailAndPasswordValid,
            }"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Section 2: Additional Information -->
      <div
        v-if="isSection2Visible"
        class="flex items-center justify-center p-4"
      >
        <div class="w-full max-w-4xl flex flex-col md:flex-row gap-6">
          <!-- Left Side -->
          <div class="flex flex-col gap-6 w-full md:w-1/2">
            <div class="flex flex-col gap-2 w-full">
              <label for="name" class="text-lg font-regular">Username:</label>
              <input
                type="text"
                id="name"
                v-model="name"
                required
                class="p-3 w-full border shadow rounded-md"
              />
            </div>
            <div class="flex flex-col gap-2 w-full">
              <label for="age" class="text-lg font-regular">Age:</label>
              <input
                type="number"
                id="age"
                v-model="age"
                required
                class="p-3 w-full border shadow rounded-md"
              />
            </div>
            <div class="flex flex-col gap-2 w-full">
              <label for="gender" class="text-lg font-regular">Gender:</label>
              <select
                id="gender"
                v-model="gender"
                required
                class="p-3 w-full border shadow rounded-md"
              >
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
            <div class="flex flex-row gap-6 w-full">
              <div class="flex flex-col gap-2 w-1/2">
                <label for="weight" class="text-lg font-regular"
                  >Weight (kg):</label
                >
                <input
                  type="number"
                  id="weight"
                  v-model="weight"
                  required
                  class="p-3 w-full border shadow rounded-md"
                />
              </div>
              <div class="flex flex-col gap-2 w-1/2">
                <label for="height" class="text-lg font-regular"
                  >Height (cm):</label
                >
                <input
                  type="number"
                  id="height"
                  v-model="height"
                  required
                  class="p-3 w-full border shadow rounded-md"
                />
              </div>
            </div>
          </div>

          <!-- Right Side -->
          <div class="flex flex-col gap-6 w-full md:w-1/2">
            <div class="flex flex-col gap-2 w-full">
              <label for="diseases" class="text-lg font-regular"
                >Disease:</label
              >
              <select
                id="diseases"
                v-model="diseases"
                required
                class="p-3 w-full border shadow rounded-md"
              >
                <option value="">Choose</option>
                <option value="diabetes">Diabetes</option>
                <option value="hypertension">Hypertension</option>
                <option value="celiac disease">Celiac Disease</option>
                <option value="food allergies">Food Allergies</option>
                <option value="food allergies">None</option>
              </select>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <label for="diseases" class="text-lg font-regular"
                >Allergies:</label
              >
              <select
                id="allergies"
                v-model="allergies"
                required
                class="p-3 w-full border shadow rounded-md"
              >
                <option value="">Choose</option>
                <option value="diabetes">Peanuts</option>
                <option value="hypertension">Shellfish</option>
                <option value="celiac disease">Eggs</option>
                <option value="food allergies">Milk</option>
                <option value="food allergies">None</option>
              </select>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <label for="exercise" class="text-lg font-regular"
                >Exercise:</label
              >
              <select
                id="exercise"
                v-model="exercise"
                required
                class="p-3 w-full border shadow rounded-md"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div
        v-if="error"
        class="error block w-full text-center bg-red-200 text-red-700 rounded-lg shadow px-4 py-2"
      >
        {{ error }}
      </div>

      <div class="flex items-center justify-between w-full gap-4 px-5">
        <router-link to="/">
          <div
            v-if="isSection2Visible"
            class="w-full px-8 py-4 bg-slate-200 text-sky-700 poppins-regular rounded-lg"
          >
            Back
          </div>
        </router-link>
        <button
          v-if="isSection2Visible"
          class="bg-sky-700 text-slate-100 w-full px-8 py-4 rounded-lg font-semibold"
          type="submit"
        >
          <i v-if="loading" class="bx bx-loader-alt animate-spin mr-2"></i>
          <span v-if="loading">Loading...</span>
          <span v-else>Register</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import path as needed
import Tagify from "@yaireo/tagify";

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
      exercise: "",
      error: null,
      isSection2Visible: false, // Controls visibility of the second section
      allergies: "",
      loading: false,
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

  mounted() {
    var input = document.getElementById("onlyMarvel");
    console.log(input);
    var tagify = new Tagify(input, {
      whitelist: this.mcuHeros,
      //  whitelist: ["ironman", "antman", "captain america", "thor", "spiderman"],
      enforceWhitelist: true,
    });
    tagify.on("add", function (e) {
      console.log(e.detail.data);
    });
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
      this.loading = true;
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
        this.loading = false;
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
.outer-frame {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scrollable-form {
  max-height: 90vh; /* Adjust as needed */
  overflow-y: auto;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.tags-look .tagify__dropdown__item {
  display: inline-block;
  vertical-align: middle;
  border-radius: 3px;
  padding: 0.3em 0.5em;
  border: 1px solid #ccc;
  background: #f3f3f3;
  margin: 0.2em;
  font-size: 0.85em;
  color: black;
  transition: 0s;
}

.tags-look .tagify__dropdown__item--active {
  border-color: black;
}

.tags-look .tagify__dropdown__item:hover {
  background: lightyellow;
  border-color: gold;
}

.tags-look .tagify__dropdown__item--hidden {
  max-width: 0;
  max-height: initial;
  padding: 0.3em 0;
  margin: 0.2em 0;
  white-space: nowrap;
  text-indent: -20px;
  border: 0;
}
</style>
