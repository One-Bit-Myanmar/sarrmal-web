<template>
  <div class="container poppins-regular bg-yellow-100" 
    :class="
      photo != null ? 'h-auto' : 'h-screen'
    ">
    <!-- header -->
    <div class="header">
      <h1 class="bg-slate-200 p-3 rounded-lg poppins-regular">
        Welcome to SarrMal, make your life style healthy!
      </h1>
      <div
        class="flex w-full items-center justify-between px-2 md:px-4 py-8 mb-14"
      >
        <!-- Optionally show user info -->
        <div class="poppins-semibold text-slate-700 text-xl md:text-2xl">
          <p>Let's take snap photo XD.</p>
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
    <div class="flex items-center justify-center mb-10 gap-6">
      <button
        @click="openCamera"
        class="text-slate-700 bg-slate-200 px-6 py-4 rounded-lg text-xl"
      >
        Take Photo
      </button>
      <button
        @click="openFilePicker"
        class="text-slate-50 bg-sky-700 px-6 py-4 rounded-lg text-xl"
      >
        Upload Photo
      </button>
    </div>
    <!-- end of the rest of buttons  -->

    <div class="container mx-auto p-4">
      <!-- Photo Preview -->
      <div v-if="photo" class="photo-preview flex flex-col items-center mb-4">
        <h3 class="text-xl font-semibold mb-2">Preview:</h3>
        <img
          :src="photo"
          alt="Selected Photo"
          class="w-3/5 h-auto rounded-lg shadow-md"
        />
      </div>

      <!-- Hidden File Input for Uploading -->
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept="image/*"
        class="hidden"
      />

      <!-- Hidden Video Element for Camera Capture -->
      <div v-if="isCameraOpen" class="flex justify-center mb-4">
        <video
          ref="video"
          autoplay
          playsinline
          class="w-3/5 h-auto rounded-lg shadow-md"
        ></video>
      </div>

      <!-- Capture Photo Button (Visible only when using the camera) -->
      <div class="flex items-center justify-center w-full">
        <button
          v-if="isCameraOpen"
          @click="capturePhoto"
          class="bg-sky-700 text-slate-50 px-4 py-2 rounded-lg shadow-lg hover:bg-sky-600"
        >
          Capture Photo
        </button>
      </div>
    </div>

    <div class="flex items-center justify-center w-full">
      <button
        v-if="photo"
        class="text-slate-50 bg-sky-700 px-6 py-4 rounded-lg text-xl"
        @click="analyzePhoto"
        :disabled="isAnalyzeButtonDisabled"
      >
        <div v-if="isloading">
          <i class="bx bx-loader-alt animate-spin mr-2"></i>
          Analyzing...
        </div>
        <div v-else>Analyze</div>
      </button>
    </div>

    <!-- add to meal plan button  -->
    <div class="flex items-center justify-center w-full">
      <button
        v-if="addToMealPlan"
        class="bg-slate-200 rounded-lg text-sky-700 capitalize font-semibold"
        @click="addToMealPlanner"
        :disabled="isAddButtonDisabled"
      >
        <div v-if="isadding">
          <i class="bx bx-loader-alt animate-spin mr-2"></i>
          Transferring to your meal plan
        </div>
        <div v-else>Add to Meal Plan</div>
      </button>
    </div>

    <div
      class="flex px-10 py-8 items-center justify-center bg-white rounded-lg shadow"
    >
      <!-- the result show session  -->
      <form
        class="flex flex-col items-start justify-start w-3/2"
        v-if="food_info"
      >
        <h3 class="text-slate-700 poppins-semibold mb-3 text-2xl">Result</h3>
        <div class="flex flex-col items-start justify-start mb-5">
          <p class="mb-2 text-sky-700 capitalize poppins-semibold">name</p>
          <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
            {{ food_info.name }}
          </p>
        </div>

        <div class="flex flex-col items-start justify-start mb-5">
          <p class="mb-2 text-sky-700 capitalize poppins-semibold">
            Calories Amount
          </p>
          <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
            {{ food_info.calories }} Calories
          </p>
        </div>

        <div class="flex flex-col items-start justify-start mb-5">
          <p class="mb-2 text-sky-700 capitalize poppins-semibold">Category</p>
          <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
            {{ food_info.category }}
          </p>
        </div>

        <div class="flex flex-col items-start justify-start mb-5">
          <p class="mb-2 text-sky-700 capitalize poppins-semibold">
            How to cook
          </p>
          <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
            {{ food_info.how_to_cook }}
          </p>
        </div>

        <div class="flex flex-col items-start justify-start mb-5">
          <p class="mb-2 text-sky-700 capitalize poppins-semibold">Meal time</p>
          <p class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
            {{ food_info.meal_time }}
          </p>
        </div>

        <div class="flex flex-col items-start justify-start mb-5">
          <p class="mb-2 text-sky-700 capitalize poppins-semibold">
            Ingredients
          </p>
          <ul class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
            <li
              v-for="(ingredient, index) in food_info.ingredients"
              :key="index"
            >
              {{ ingredient }}
            </li>
          </ul>
        </div>
      </form>
      <!-- else if  -->
      <div
        class="flex flex-col items-center justify-center w-full"
        v-else-if="food_error"
      >
        <h1 class="text-yellow-500 text-center">{{ food_error }}</h1>
      </div>
      <!-- else  -->
      <div class="flex flex-col items-center justify-center w-full" v-else>
        <h1 class="text-slate-500 text-center">the result will show here.</h1>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup

export default {
  data() {
    return {
      food_info: null,
      food_error: null,
      photo: null, // This will store the URL of the selected photo
      file: null,
      isCameraOpen: false, // Track whether the camera is open
      addToMealPlan: false, // Flag to track whether the user wants to add to meal plan
      isAddButtonDisabled: false, // control the add button to disable
      isAnalyzeButtonDisabled: true,
      isloading: false,
      isadding: false,
    };
  },

  async created() {
    // Check if user is logged in when the component is created
    await this.checkAuthentication();
  },

  watch: {
    photo(newVal) {
      if (newVal) {
        this.isAnalyzeButtonDisabled = false;
        this.addToMealPlan = false; // Hide the "Add to Meal Plan" button
      }
    },
    file(newVal) {
      if (newVal) {
        this.isAnalyzeButtonDisabled = false;
        this.addToMealPlan = false; // Hide the "Add to Meal Plan" button
      }
    },
  },

  methods: {
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

    // open camera function to pick realtime photo
    openCamera() {
      console.log("camera opened");
      // Show video element and trigger camera access
      this.isCameraOpen = true;
      this.isAnalyzeButtonDisabled = true;
      this.photo = null;
      this.addToMealPlan = false;
      this.food_info = null;
      this.food_error = null;
      // this.$refs.video.style.display = "block";
      this.startCamera();
    },

    // open file picker to pick photo from device
    openFilePicker() {
      this.addToMealPlan = false;
      this.food_error = null;
      this.food_info = null;
      this.isCameraOpen = false;
      this.isAnalyzeButtonDisabled = true;
      this.photo = null;
      // Trigger the file input to open the file picker
      this.$refs.fileInput.click();
    },

    // start camera when user start to take photo
    async startCamera() {
      this.photo = null;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.$refs.video.srcObject = stream;
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    },

    // analyze photo method
    async analyzePhoto() {
      this.isloading = true;
      console.log(this.file);
      if (this.file) {
        try {
          const token = localStorage.getItem("authToken");
          const formData = new FormData();
          formData.append("file", this.file);
          const response = await axiosInstance.post(
            "food/get/calories",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          // Handle the API response
          if (!response.data.message) {
            this.addToMealPlan = true;
            this.food_info = response.data;
            this.food_error = null;
          } else {
            this.food_error = response.data.message;
            this.food_info = null;
          }
          this.isAnalyzeButtonDisabled = true;
          this.isloading = false;
          // debug
          console.log(response);
          console.log("food error", this.food_error);
        } catch (error) {
          this.HandleError(error);
          this.isloading = false;
        }
      }
    },

    // add to meal planner function
    async addToMealPlanner() {
      if (this.food_info) {
        this.isadding = true;
        try {
          const token = localStorage.getItem("authToken");
          const response = await axiosInstance.post(
            "food/add/generated_calories",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          this.food_info = response.data;
          if (response.data) {
            this.isAddButtonDisabled = true; // Disable the button
            this.$router.push("/meals/confirmed"); // go to the meal planner
          }
        } catch (error) {
          this.isadding = false;
          this.HandleError(error);
        }
      }
    },

    capturePhoto() {
      const video = this.$refs.video;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.photo = canvas.toDataURL("image/png");

      // Convert data URL to file
      this.file = this.dataURLtoFile(this.photo, "captured-photo.png");

      // Hide video element and stop camera stream
      this.isCameraOpen = false;
      this.$refs.video.style.display = "none";
      const stream = this.$refs.video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photo = e.target.result; // Store the photo URL
          this.file = file;
        };
        // Close the video session if it's open
        if (this.isCameraOpen) {
          this.isCameraOpen = false;
          this.$refs.video.style.display = "none";

          // Stop the video stream
          const stream = this.$refs.video.srcObject;
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            this.$refs.video.srcObject = null; // Clear the video source
          }
        }
        this.food_info = null;
        this.food_error = null;
        reader.readAsDataURL(file); // Convert the file to a data URL
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

    // change data url to file
    dataURLtoFile(dataURL, filename) {
      const [header, data] = dataURL.split(",");
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(data);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new File([new Uint8Array(array)], filename, { type: mime });
    },
  },
};
</script>

<style scoped>
.photo-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.button-container {
  margin: 20px 0;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.photo-preview {
  margin-top: 20px;
  text-align: center;
}

.photo-preview img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

video {
  max-width: 100%;
  height: auto;
}
</style>
