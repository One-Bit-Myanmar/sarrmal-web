<template>
  <div class="photo-page">
    <h2>Choose Photo Option</h2>

    <router-link to="/main">Back to main</router-link>

    <div class="button-container">
      <button @click="openCamera">Take Photo</button>
      <button @click="openFilePicker">Upload Photo</button>
    </div>

    <div v-if="photo" class="photo-preview">
      <h3>Preview:</h3>
      <img :src="photo" alt="Selected Photo" />
    </div>

    <!-- Hidden File Input for Uploading -->
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      accept="image/*"
      style="display: none"
    />

    <!-- Hidden Video Element for Camera Capture -->
    <video ref="video" autoplay playsinline style="display: none"></video>
    <!-- Capture Photo Button (Visible only when using the camera) -->
    <button v-if="isCameraOpen" @click="capturePhoto">Capture Photo</button>

    <button
      v-if="photo"
      @click="analyzePhoto"
      :disabled="isAnalyzeButtonDisabled"
    >
      Analyze
    </button>

    <div class="" v-if="food_info">
        <h3>Result:</h3>
        <p>name : {{ food_info.name }}</p>
        <p>category : {{ food_info.category }}</p>
        <p>How to cook : {{ food_info.how_to_cook }}</p>
        <p>meal time : {{ food_info.meal_time }}</p>
        <p>Ingredient: 
            <ul>
                <li v-for="(ingredient, index) in food_info.ingredients" :key="index">
                    {{ ingredient }}
                </li>
            </ul>
        </p>
    </div>

    <button
      v-if="addToMealPlan"
      @click="addToMealPlanner"
      :disabled="isAddButtonDisabled"
    >
      Add to meal plan
    </button>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup

export default {
  data() {
    return {
      food_info: null,
      photo: null, // This will store the URL of the selected photo
      file: null,
      isCameraOpen: false, // Track whether the camera is open
      addToMealPlan: false, // Flag to track whether the user wants to add to meal plan
      isAddButtonDisabled: false, // control the add button to disable
      isAnalyzeButtonDisabled: true,
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
      // Show video element and trigger camera access
      this.isCameraOpen = true;
      this.isAnalyzeButtonDisabled = true;
      this.photo = null;
      this.$refs.video.style.display = "block";
      this.startCamera();
    },

    // open file picker to pick photo from device
    openFilePicker() {
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
          this.food_info = response.data
          // Handle the API response
          console.log(response.data);
          if (!response.data.message) {
            this.addToMealPlan = true;
          }
          this.isAnalyzeButtonDisabled = true;
        } catch (error) {
          this.HandleError(error);
        }
      }
    },

    // add to meal planner function
    async addToMealPlanner() {
        if (this.food_info) {
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
                this.$router.push('/meals/confirmed'); // go to the meal planner
            }
        } catch (error) {
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
