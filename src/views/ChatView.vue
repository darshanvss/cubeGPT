<template>
  <main>
    <div class="container mt-3">
      <!-- Chat messages display area -->
      <div class="chat-messages">
        <!-- Messages will be displayed here -->
      </div>

      <!-- Input field at the bottom -->
      <div class="input-group mt-3">
        <input
          type="text"
          class="form-control"
          placeholder="Type your message..."
          v-model="newMessage"
          @keyup.enter="sendMessage"
        />
        <div class="input-group-append">
          <button class="btn btn-primary" type="button" @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { generateTest } from '@/api/gemini'
export default {
  name: 'ChatView',
  data() {
    return {
      userName: '',
      newMessage: ''
    }
  },
  methods: {
    async sendMessage() {
      // Your logic to send the message
      const message = this.newMessage.trim()
      if (message !== '') {
        // Append the message to the chat messages display area
        const chatMessages = document.querySelector('.chat-messages')
        const messageDiv = document.createElement('div')
        messageDiv.className = 'message response'
        messageDiv.textContent = message
        chatMessages.appendChild(messageDiv)

        // Clear the input field
        this.newMessage = ''
        const llmResponse = await generateTest(message)
        const responseDiv = document.createElement('div')
        responseDiv.className = 'message response'
        responseDiv.textContent = llmResponse
        chatMessages.appendChild(responseDiv)
      }
    }
  }
}
</script>

<style scoped>
/* Add your custom styling here */
.chat-messages {
  height: 80vh;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
