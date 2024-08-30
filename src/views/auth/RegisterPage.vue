<template>
  <div style="" class="h-screen overflow-y-scroll py-6 register-wrapper">
    <div class="p-6 bg-light rounded-lg shadow poppins-regular bg-slate-50">
      <h1 class="mb-8 text-xl poppins-semibold text-sky-700">Register</h1>
      <form
        @submit.prevent="handleSubmit"
        class="flex flex-col items-start justify-center gap-6"
        :class="{
          'w-[350px]': !isSection2Visible,
          'w-[500px]': isSection2Visible,
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
          class="flex flex-col items-center justify-center p-4"
        >
          <div class="w-full max-w-4xl flex flex-col gap-6">
            <!-- Left Side -->
            <div class="flex flex-col gap-6 w-full">
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
                  <option value="">Choose</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                  <option value="2">Other</option>
                </select>
              </div>
              <div class="flex flex-row gap-6 w-full">
                <div class="flex flex-col gap-2 w-full">
                  <label for="weight" class="text-lg font-regular"
                    >Weight (kg):</label
                  >
                  <input
                    type="number"
                    id="weight"
                    v-model="weight"
                    required
                    placeholder="0"
                    class="p-3 w-full border shadow rounded-md"
                  />
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <label for="height" class="text-lg font-regular"
                    >Height (cm):</label
                  >
                  <input
                    type="number"
                    id="height"
                    v-model="height"
                    required
                    placeholder="0"
                    class="p-3 w-full border shadow rounded-md"
                  />
                </div>
              </div>
            </div>

            <!-- Right Side -->
            <div class="flex flex-col gap-6 w-full">
              <div class="flex flex-col gap-2 w-full">
                <label for="diseases" class="text-lg font-regular"
                  >Disease:</label
                >
                <div class="relative">
                  <select
                    id="diseases"
                    v-model="selectedDiseases"
                    required
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg cursor-pointer text-slate-700 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="" selected>Choose</option>
                    <option
                      v-for="disease in diseaseOptions"
                      :key="disease.value"
                      :value="disease.value"
                    >
                      {{ disease.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="flex flex-col gap-2 w-full">
                <label for="diseases" class="text-lg font-regular"
                  >Allergies:</label
                >
                <ul
                  class="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3"
                >
                  <li
                    v-for="allergie in allergiesOptions"
                    :key="allergie.value"
                  >
                    <input
                      type="checkbox"
                      :id="allergie.value"
                      :value="allergie.value"
                      v-model="allergies"
                      class="hidden peer"
                    />
                    <label
                      :for="allergie.value"
                      class="inline-flex items-center justify-between w-auto px-2 py-2 text-slate-700 bg-white border-2 rounded-lg cursor-pointer border-gray-300 peer-checked:border-blue-600 peer-checked:text-sky-700 hover:bg-sky-100"
                    >
                      <div class="block">
                        <div class="w-auto font-semibold">
                          {{ allergie.label }}
                        </div>
                      </div>
                    </label>
                  </li>
                </ul>
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
                  <option value="" selected>Choose</option>
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
          <router-link to="/register">
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
      exercise: "",
      error: null,
      isSection2Visible: false, // Controls visibility of the second section
      allergies: [],
      loading: false,
      selectedDiseases: "", // This will hold the selected disease value
      diseaseOptions: [
        { value: "diabetes-type1", label: "Diabetes Type 1" },
        { value: "diabetes-type2", label: "Diabetes Type 2" },
        { value: "hypertension", label: "Hypertension" },
        { value: "none", label: "None" },
      ],
      allergiesOptions: [
        { value: "peanuts", label: "Peanuts" },
        { value: "tree_nuts", label: "Tree Nuts" },
        { value: "milk", label: "Milk" },
        { value: "eggs", label: "Eggs" },
        { value: "fish", label: "Fish" },
        { value: "shellfish", label: "Shellfish" },
        { value: "soy", label: "Soy" },
        { value: "wheat", label: "Wheat" },
        { value: "others", label: "Others" },
        { value: "none", label: "None" },
      ],
    };
  },

  watch: {
    diseases(newValues) {
      console.log("Selected diseases:", newValues);
    },
    allergies(newValues) {
      console.log("Selected allegries:", newValues);
    },
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
        !this.selectedDiseases ||
        this.allergies.length === 0 ||
        !this.exercise ||
        !this.age
      ) {
        this.error = "Please fill in all required fields.";
        return;
      } else {
        console.log(this.allergies);
        this.loading = true;
        try {
          // Register new user
          const response = await axiosInstance.post("user/register", {
            username: this.name,
            email: this.email,
            password: this.password,
            gender: parseInt(this.gender),
            weight: parseFloat(this.weight),
            height: parseFloat(this.height),
            diseases: [this.selectedDiseases],
            allergies: this.allergies,
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
.register-wrapper::-webkit-scrollbar {
  display: none; /* Webkit browsers */
}
</style>
