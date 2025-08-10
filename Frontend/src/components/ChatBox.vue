<script setup>
import { ref } from 'vue';

const isChatOpen = ref(false);
const selectedUser = ref(null);
const messages = ref({
  1: [{ sender: 'User1', text: 'Hello!' }, { sender: 'You', text: 'Hi there!' }],
  2: [{ sender: 'User2', text: 'How’s it going?' }],
  3: [{ sender: 'User3', text: 'New message!' }]
});
const newMessage = ref('');

const users = ref([
  { id: 1, name: 'User1', avatar: '👨' },
  { id: 2, name: 'User2', avatar: '👩' },
  { id: 3, name: 'User3', avatar: '🧑' }
]);

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const selectUser = (user) => {
  selectedUser.value = user;
};

const sendMessage = () => {
  if (newMessage.value.trim() && selectedUser.value) {
    messages.value[selectedUser.value.id].push({ sender: 'You', text: newMessage.value });
    newMessage.value = '';
  }
};
</script>

<template>
  <div class="chat-box" :class="{ open: isChatOpen }">
    <button class="chat-toggle" @click="toggleChat">
      {{ isChatOpen ? 'Close Chat' : 'Open Chat' }}
    </button>
    <div class="chat-content" v-if="isChatOpen">
      <div class="user-panel">
        <h3>Users</h3>
        <div class="user-list">
          <div
            v-for="user in users"
            :key="user.id"
            class="user-item"
            :class="{ active: selectedUser && selectedUser.id === user.id }"
            @click="selectUser(user)"
          >
            <div class="user-content">
              <span class="user-avatar">{{ user.avatar }}</span>
              <span class="user-name">{{ user.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-messages">
        <div v-if="selectedUser" class="messages-container">
          <div v-for="(message, index) in messages[selectedUser.id]" :key="index" class="message">
            <strong>{{ message.sender }}:</strong> {{ message.text }}
          </div>
        </div>
        <div v-else class="no-user-selected">Select a user to start chatting</div>
        <div class="message-input">
          <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
          <button @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-box {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(26, 34, 56, 0.8) 0%, rgba(0, 196, 180, 0.8) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  font-family: 'Inter', sans-serif;
}

.chat-box.open {
  height: 500px;
}

.chat-toggle {
  background: #f59e0b;
  color: #ffffff;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.chat-toggle:hover {
  background: #fb923c;
}

.chat-content {
  display: flex;
  height: calc(100% - 44px);
}

.user-panel {
  width: 140px;
  background: rgba(26, 34, 56, 0.9);
  border-right: 1px solid #00c4b4;
  padding: 15px;
  overflow-y: auto;
  overflow-x: auto;
}

.user-panel h3 {
  color: #f59e0b;
  font-size: 18px;
  margin: 0 0 10px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f59e0b;
  padding: 4px;
}

.user-item:hover .user-content,
.user-item.active .user-content {
  background: rgba(0, 196, 180, 0.2);
  color: #fb923c;
  border-radius: 8px;
}

.user-avatar {
  font-size: 24px;
}

.user-name {
  flex: 1;
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.message {
  color: #f59e0b;
  font-size: 14px;
  margin-bottom: 12px;
}

.no-user-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  font-size: 14px;
}

.message-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #00c4b4;
  border-radius: 8px;
  background: rgba(26, 34, 56, 0.7);
  color: #ffffff;
  font-size: 14px;
}

.message-input button {
  background: #f59e0b;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.message-input button:hover {
  background: #fb923c;
}

/* Light mode styles */
.light-mode .chat-box {
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(224, 247, 250, 0.8) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.light-mode .chat-toggle {
  background: #b45309;
}

.light-mode .chat-toggle:hover {
  background: #fb923c;
}

.light-mode .user-panel {
  background: rgba(248, 250, 252, 0.9);
  border-right: 1px solid #4b9cd3;
}

.light-mode .user-panel h3,
.light-mode .user-content,
.light-mode .message,
.light-mode .no-user-selected {
  color: #b45309;
}

.light-mode .user-item:hover .user-content,
.light-mode .user-item.active .user-content {
  background: rgba(75, 156, 211, 0.2);
  color: #fb923c;
}

.light-mode .messages-container {
  background: rgba(255, 255, 255, 0.5);
}

.light-mode .message-input input {
  background: rgba(248, 250, 252, 0.7);
  color: #1a2238;
  border: 1px solid #4b9cd3;
}

.light-mode .message-input button {
  background: #b45309;
}

.light-mode .message-input button:hover {
  background: #fb923c;
}
</style>