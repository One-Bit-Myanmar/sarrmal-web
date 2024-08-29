<template>
  <div class="container h-screen flex flex-col">
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
          <p>How do you feel about today?</p>
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

    <div class="flex items-center justify-center w-full">
      <div class="flex flex-col h-screen w-full md:w-1/2">
        <!-- Chat Box -->
        <div
          class="chat-box flex-1 overflow-y-auto p-4 bg-gray-100"
          style="height: 30vh !important"
        >
          <!-- Loading Page -->
          <LoadingPage v-if="loading" />

          <!-- Error Page -->
          <ErrorPage v-if="error" :message="errorMessage" />

          <div v-else>
            <!-- Messages -->
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="[
                'message mb-10',
                message.sender === 'user'
                  ? 'text-right bg-sky-600 text-slate-200'
                  : 'text-left bg-slate-200 text-slate-700 mb-6',
              ]"
            >
              <div v-html="renderMarkdown(message.text)"></div>
              <!-- <span class="timestamp">{{ formatDate(message.date) }}</span> -->
            </div>
          </div>

          <div
            v-if="temp_message"
            class="text-right bg-sky-600 text-slate-200 p-2 rounded-lg"
          >
            {{ temp_message }}
          </div>
        </div>

        <!-- Message Input -->
        <div
          class="poppins-regular bg-slate-200 shadow flex items-center justify-between p-3 gap-3 rounded-lg"
        >
          <input
            type="text"
            class="w-full p-3 rounded"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
          />
          <button
            @click="sendMessage"
            class="flex items-center bg-sky-700 text-slate-50 rounded-lg p-3"
            :disabled="!newMessage.trim()"
          >
            Send <i class="bx bx-send ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup
import { marked } from "marked";
import LoadingPage from "@/components/LoadingPage.vue";
import ErrorPage from "@/components/ErrorPage.vue";

export default {
  name: "ConsultAiPage",
  components: {
    LoadingPage,
    ErrorPage,
  },
  data() {
    return {
      messages: [], // Empty initially
      newMessage: "",
      loading: true,
      error: false,
      temp_message: null,
      errorMessage: "",
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
        await this.getPreviousChat();
      } catch (error) {
        this.error = true;
        this.errorMessage = error;
        console.log(this.errorMessage);
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

    renderMarkdown(text) {
      return marked(text);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },

    // send message function
    async sendMessage() {
      this.temp_message = this.newMessage;
      if (this.newMessage.trim() !== "") {
        try {
          const token = localStorage.getItem("authToken");
          // Send the user's message to the AI chat API
          const response = await axiosInstance.post(
            "ai/chat",
            {
              message: this.newMessage,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Add the user's message
          this.messages.push({ text: this.newMessage, sender: "user" });
          // Add the AI's response
          this.messages.push({
            text: response.data.data || "I'm an AI, how can I help you?",
            sender: "ai",
          });
          this.temp_message = null;
        } catch (error) {
          this.HandleError(error);
        }
        // Clear the input field
        this.newMessage = "";
      }
    },

    // get the previous  chat by day
    async getPreviousChat() {
      try {
        const token = localStorage.getItem("authToken");
        // Fetch previous chat messages from the API
        const response = await axiosInstance.get("ai/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Add the previous chat messages to the messages array
        const chatArray = response.data["data"];
        // Format the messages for the chat UI
        this.messages = chatArray.flatMap((chat) => [
          {
            text: chat.message, // User's message
            sender: "user",
            date: chat.date, // Optional: For displaying timestamp
          },
          {
            text: chat.response, // AI's response
            sender: "ai",
            date: chat.date, // Optional: For displaying timestamp
          },
        ]);
      } catch (error) {
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
.message {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.message.user {
  background-color: #0970c4 !important; /* Light blue for user messages */
}

.message.ai {
  background-color: #f1f1f1 !important; /* Light gray for AI messages */
}
</style>
