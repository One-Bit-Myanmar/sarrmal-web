<template>
  <div class="chat-container">

    <router-link to="/main">Back to main</router-link>
    <div class="chat-header">
      <h2>AI Chat</h2>
    </div>
    <div class="chat-box">
      <!-- Placeholder text before user starts chatting -->
      <p v-if="messages.length === 0" class="placeholder-text">
        Consult with chat bot
      </p>

      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.sender]"
      >
        <div v-html="renderMarkdown(message.text)"></div>
        <!-- <span class="timestamp">{{ formatDate(message.date) }}</span> -->
      </div>
    </div>
    <div class="chat-input">
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
      <button @click="sendMessage" :disabled="!newMessage.trim()">Send</button>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axios"; // Adjust the import based on your project setup
import { marked } from 'marked';

export default {
  data() {
    return {
      messages: [], // Empty initially
      newMessage: "",
    };
  },

  async created() {
    // Check if user is logged in when the component is created
    await this.checkAuthentication();
    if (this.isLoggedIn) {
      await this.getPreviousChat();
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
        const chatArray = response.data["data"]
        // Format the messages for the chat UI
        this.messages = chatArray.flatMap(chat => [
          {
            text: chat.message,  // User's message
            sender: "user",
            date: chat.date,     // Optional: For displaying timestamp
          },
          {
            text: chat.response, // AI's response
            sender: "ai",
            date: chat.date,     // Optional: For displaying timestamp
          }
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

<style>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.chat-header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
}

.chat-box {
  flex: 1;
  padding: 10px;
  background-color: #f4f4f4;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
}

.message.user {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
}

.message.ai {
  background-color: #e1e1e1;
  align-self: flex-start;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-right: 10px;
}

.chat-input button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3;
}
</style>
