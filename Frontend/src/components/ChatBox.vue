<script setup>
import { ref, computed } from 'vue';
defineProps({
  isAuthenticated: Boolean,
});

const isChatOpen = ref(true); // Chat open by default for better visibility
const selectedUser = ref(null);
const selectedGroup = ref(null);
const messages = ref({
  1: [
    { id: 1, sender: 'User1', avatar: '👨', text: 'Hello!', timestamp: new Date(Date.now() - 3600000), reactions: [] },
    { id: 2, sender: 'You', avatar: '😊', text: 'Hi there!', timestamp: new Date(Date.now() - 3500000), reactions: ['👍'] },
  ],
  2: [{ id: 1, sender: 'User2', avatar: '👩', text: 'How’s it going?', timestamp: new Date(Date.now() - 7200000), reactions: [] }],
  3: [{ id: 1, sender: 'User3', avatar: '🧑', text: 'New message!', timestamp: new Date(Date.now() - 1800000), reactions: [] }],
  group_1: [
    { id: 1, sender: 'User1', avatar: '👨', text: 'Welcome to the group!', timestamp: new Date(Date.now() - 3600000), reactions: [] },
    { id: 2, sender: 'You', avatar: '😊', text: 'Excited to be here!', timestamp: new Date(Date.now() - 3500000), reactions: ['❤️'] },
  ],
});
const newMessage = ref('');
const newGroupName = ref('');
const typing = ref(false);
const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😎'];
const searchQuery = ref('');

const users = ref([
  { id: 1, name: 'User1', avatar: '👨', online: true },
  { id: 2, name: 'User2', avatar: '👩', online: false },
  { id: 3, name: 'User3', avatar: '🧑', online: true },
]);

const groups = ref([
  { id: 'group_1', name: 'Project Team', members: [1, 2, 3], avatar: '👥' },
]);

const toggleChat = () => {
  if (isAuthenticated) {
    isChatOpen.value = !isChatOpen.value;
  }
};

const selectUser = (user) => {
  if (isAuthenticated) {
    selectedUser.value = user;
    selectedGroup.value = null;
  }
};

const selectGroup = (group) => {
  if (isAuthenticated) {
    selectedGroup.value = group;
    selectedUser.value = null;
  }
};

const sendMessage = () => {
  if (isAuthenticated && newMessage.value.trim() && (selectedUser.value || selectedGroup.value)) {
    const chatId = selectedUser.value ? selectedUser.value.id : selectedGroup.value.id;
    messages.value[chatId].push({
      id: messages.value[chatId].length + 1,
      sender: 'You',
      avatar: '😊',
      text: newMessage.value,
      timestamp: new Date(),
      reactions: [],
    });
    newMessage.value = '';
    typing.value = false;
    console.log('Message sent!');
  }
};

const startTyping = () => {
  if (isAuthenticated) {
    typing.value = true;
    setTimeout(() => (typing.value = false), 2000);
  }
};

const createGroup = () => {
  if (isAuthenticated && newGroupName.value.trim()) {
    const groupId = `group_${groups.value.length + 1}`;
    groups.value.push({
      id: groupId,
      name: newGroupName.value,
      members: [1, 2, 3], // Example: all users
      avatar: '👥',
    });
    messages.value[groupId] = [];
    newGroupName.value = '';
    console.log('Group created!');
  }
};

const addEmoji = (emoji) => {
  if (isAuthenticated) {
    newMessage.value += emoji;
  }
};

const addReaction = (message, emoji) => {
  if (isAuthenticated && !message.reactions.includes(emoji)) {
    message.reactions.push(emoji);
    console.log(`Added reaction ${emoji} to message!`);
  }
};

const shareFile = (file) => {
  if (isAuthenticated && file) {
    const chatId = selectedUser.value ? selectedUser.value.id : selectedGroup.value.id;
    messages.value[chatId].push({
      id: messages.value[chatId].length + 1,
      sender: 'You',
      avatar: '😊',
      text: `Shared file: ${file.name}`,
      file: URL.createObjectURL(file),
      isFile: true,
      timestamp: new Date(),
      reactions: [],
    });
    console.log(`File shared: ${file.name}`);
  }
};

const sendVoiceMessage = () => {
  if (isAuthenticated) {
    const chatId = selectedUser.value ? selectedUser.value.id : selectedGroup.value.id;
    messages.value[chatId].push({
      id: messages.value[chatId].length + 1,
      sender: 'You',
      avatar: '😊',
      text: 'Voice message (recording not implemented)',
      isVoice: true,
      timestamp: new Date(),
      reactions: [],
    });
    console.log('Voice message placeholder sent! Actual recording requires Web Audio API.');
  }
};

const deleteMessage = (chatId, messageId) => {
  if (isAuthenticated) {
    messages.value[chatId] = messages.value[chatId].filter((msg) => msg.id !== messageId);
    console.log('Message deleted!');
  }
};

const filteredUsers = computed(() => {
  return users.value.filter((user) => user.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const filteredGroups = computed(() => {
  return groups.value.filter((group) => group.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const formatTime = (timestamp) => {
  const now = new Date();
  const diff = (now - new Date(timestamp)) / 1000;
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
</script>

<template>
  <div class="chat-box" :class="{ open: isChatOpen, disabled: !isAuthenticated }">
    <div class="hero-section">
      <button class="chat-toggle" @click="toggleChat" :disabled="!isAuthenticated">
        <i class="fas fa-comments"></i> {{ isChatOpen ? 'Close Chat' : 'Open Chat' }}
      </button>
    </div>
    <div class="chat-content" v-if="isChatOpen">
      <div class="user-panel">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            placeholder="Search users"
            class="search-input"
            :disabled="!isAuthenticated"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <h3>Users</h3>
        <div class="user-list">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="user-item"
            :class="{ active: selectedUser && selectedUser.id === user.id }"
            @click="selectUser(user)"
          >
            <div class="user-content">
              <span class="user-avatar" :class="{ online: user.online }">{{ user.avatar }}</span>
              <span class="user-name">{{ user.name }}</span>
              <span class="status-indicator">{{ user.online ? 'Online' : 'Offline' }}</span>
            </div>
          </div>
        </div>
        <h3>Groups</h3>
        <div class="group-list">
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            class="group-item"
            :class="{ active: selectedGroup && selectedGroup.id === group.id }"
            @click="selectGroup(group)"
          >
            <div class="group-content">
              <span class="group-avatar">{{ group.avatar }}</span>
              <span class="group-name">{{ group.name }}</span>
            </div>
          </div>
        </div>
        <div class="group-form">
          <input
            v-model="newGroupName"
            placeholder="New Group Name"
            class="form-input"
            :disabled="!isAuthenticated"
          />
          <button @click="createGroup" class="form-button" :disabled="!isAuthenticated">
            <i class="fas fa-users"></i> Create Group
          </button>
        </div>
      </div>
      <div class="chat-messages">
        <div v-if="selectedUser || selectedGroup" class="messages-container">
          <h3 class="chat-header">{{ selectedUser ? selectedUser.name : selectedGroup.name }}</h3>
          <div
            v-for="message in messages[selectedUser ? selectedUser.id : selectedGroup.id]"
            :key="message.id"
            class="message"
            :class="{ 'own-message': message.sender === 'You' }"
          >
            <span class="message-avatar">{{ message.avatar }}</span>
            <div class="message-content">
              <div class="message-header">
                <strong>{{ message.sender }}</strong>
                <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
              </div>
              <p v-if="!message.isFile && !message.isVoice">{{ message.text }}</p>
              <img
                v-if="message.isFile && message.file.includes('image')"
                :src="message.file"
                alt="Shared Image"
                class="message-media"
              />
              <video
                v-if="message.isFile && message.file.includes('video')"
                :src="message.file"
                controls
                class="message-media"
              ></video>
              <p v-if="message.isVoice">Voice message (recording not implemented)</p>
              <div class="reactions">
                <span v-for="reaction in message.reactions" :key="reaction" class="reaction">{{ reaction }}</span>
              </div>
              <div class="reaction-picker">
                <button
                  v-for="emoji in emojis"
                  :key="emoji"
                  @click="addReaction(message, emoji)"
                  :disabled="!isAuthenticated"
                >
                  {{ emoji }}
                </button>
              </div>
              <button
                v-if="message.sender === 'You'"
                @click="deleteMessage(selectedUser ? selectedUser.id : selectedGroup.id, message.id)"
                class="delete-message"
                :disabled="!isAuthenticated"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div v-if="typing" class="typing-indicator">Typing...</div>
        </div>
        <div v-else class="no-user-selected">Select a user or group to start chatting</div>
        <div class="message-input">
          <input
            v-model="newMessage"
            @keyup="startTyping"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
            class="form-input"
            :disabled="!isAuthenticated"
          />
          <div class="emoji-picker">
            <button
              v-for="emoji in emojis"
              :key="emoji"
              @click="addEmoji(emoji)"
              :disabled="!isAuthenticated"
            >
              {{ emoji }}
            </button>
          </div>
          <input
            type="file"
            accept="image/*,video/*"
            @change="shareFile($event.target.files[0])"
            class="form-file"
            :disabled="!isAuthenticated"
          />
          <button @click="sendVoiceMessage" class="action-button" :disabled="!isAuthenticated">
            <i class="fas fa-microphone"></i>
          </button>
          <button @click="sendMessage" class="action-button" :disabled="!isAuthenticated">
            <i class="fas fa-paper-plane"></i> Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.chat-box {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 600px;
  max-width: 90vw;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-box.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.chat-box.open {
  height: 600px;
  transform: translateY(0);
}

.hero-section {
  padding: 10px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 16px 16px 0 0;
}

.chat-toggle {
  background: transparent;
  color: #f9fafb;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.chat-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.chat-toggle:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.chat-content {
  display: flex;
  height: calc(100% - 56px);
}

.user-panel {
  width: 160px;
  background: rgba(30, 41, 59, 0.95);
  border-right: 1px solid #3b82f6;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.user-panel h3 {
  color: #f9fafb;
  font-size: 16px;
  margin: 10px 0;
}

.search-bar {
  position: relative;
  margin-bottom: 15px;
}

.search-input {
  width: 70%;
  padding: 8px 36px 8px 12px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.search-input:focus:not(:disabled) {
  outline: none;
  border-color: #60a5fa;
  background: rgba(15, 23, 42, 0.9);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #60a5fa;
}

.user-list,
.group-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.user-item,
.group-item {
  padding: 6px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-item:not(.active):not(:hover),
.group-item:not(.active):not(:hover) {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

.user-content,
.group-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f9fafb;
  padding: 4px;
}

.user-item:hover .user-content,
.user-item.active .user-content,
.group-item:hover .group-content,
.group-item.active .group-content {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-radius: 8px;
  transform: scale(1.02);
}

.user-avatar,
.group-avatar {
  font-size: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.user-avatar.online::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 6px #22c55e;
}

.user-name,
.group-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
}

.status-indicator {
  font-size: 11px;
  color: #94a3b8;
}

.group-form {
  margin-top: 15px;
  display: grid;
  gap: 8px;
}

.form-input {
  padding: 8px;
  width: 140px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 13px;
}

.form-input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.form-input:focus:not(:disabled) {
  outline: none;
  border-color: #60a5fa;
  background: rgba(15, 23, 42, 0.9);
}

.form-button,
.action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #f9fafb;
  width: 160px;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.form-button:disabled,
.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.form-button:hover:not(:disabled),
.action-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: hidden;
}

.chat-header {
  font-size: 18px;
  font-weight: 600;
  color: #f9fafb;
  margin-bottom: 10px;
  text-align: center;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: rgba(2, 6, 23, 0.5);
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 rgba(2, 6, 23, 0.5);
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}

.message {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  animation: fadeIn 0.3s ease;
}

.message.own-message {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content {
  background: rgba(59, 130, 246, 0.15);
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 65%;
  position: relative;
  word-break: break-word;
}

.own-message .message-content {
  background: rgba(34, 197, 94, 0.2);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.message-header strong {
  font-size: 13px;
  color: #f9fafb;
}

.timestamp {
  font-size: 11px;
  color: #94a3b8;
}

.message p {
  font-size: 13px;
  margin: 0;
  color: #f9fafb;
}

.message-media {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 5px;
}

.reactions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.reaction {
  font-size: 16px;
}

.reaction-picker {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.reaction-picker button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s ease;
}

.reaction-picker button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.reaction-picker button:hover:not(:disabled) {
  transform: scale(1.2);
}

.delete-message {
  background: transparent;
  border: none;
  color: #ef4444;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-message:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.delete-message:hover:not(:disabled) {
  color: #f87171;
}

.typing-indicator {
  color: #94a3b8;
  font-style: italic;
  font-size: 13px;
  animation: pulse 1s infinite;
  padding: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.no-user-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f9fafb;
  font-size: 14px;
}

.message-input {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.form-file {
  color: #f9fafb;
  font-size: 13px;
}

.form-file:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.emoji-picker {
  display: flex;
  gap: 4px;
}

.emoji-picker button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s ease;
}

.emoji-picker button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.emoji-picker button:hover:not(:disabled) {
  transform: scale(1.2);
}

.light-mode .chat-box {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.95), rgba(191, 219, 254, 0.9));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.light-mode .hero-section {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.light-mode .chat-toggle {
  color: #1f2937;
}

.light-mode .chat-toggle:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.light-mode .user-panel {
  background: rgba(243, 244, 246, 0.95);
  border-right: 1px solid #3b82f6;
}

.light-mode .user-panel h3,
.light-mode .user-content,
.light-mode .group-content,
.light-mode .message p,
.light-mode .message-header strong,
.light-mode .no-user-selected,
.light-mode .chat-header {
  color: #1f2937;
}

.light-mode .user-item:hover .user-content,
.light-mode .user-item.active .user-content,
.light-mode .group-item:hover .group-content,
.light-mode .group-item.active .group-content {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.light-mode .messages-container {
  background: rgba(255, 255, 255, 0.5);
}

.light-mode .message-content {
  background: rgba(59, 130, 246, 0.1);
}

.light-mode .own-message .message-content {
  background: rgba(34, 197, 94, 0.1);
}

.light-mode .form-input,
.light-mode .search-input {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .form-input:focus:not(:disabled),
.light-mode .search-input:focus:not(:disabled) {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .form-button,
.light-mode .action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .form-button:hover:not(:disabled),
.light-mode .action-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .typing-indicator,
.light-mode .timestamp,
.light-mode .status-indicator {
  color: #64748b;
}

.light-mode .user-avatar,
.light-mode .group-avatar,
.light-mode .message-avatar {
  background: #3b82f6;
}

.light-mode .user-avatar.online::after {
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.light-mode .delete-message {
  color: #ef4444;
}

.light-mode .delete-message:hover:not(:disabled) {
  color: #f87171;
}

@media (max-width: 768px) {
  .chat-box {
    width: 90vw;
    bottom: 10px;
    right: 10px;
  }
  .chat-box.open {
    height: 80vh;
  }
  .user-panel {
    width: 120px;
  }
  .chat-header {
    font-size: 16px;
  }
  .message-content {
    max-width: 75%;
  }
  .user-avatar,
  .group-avatar,
  .message-avatar {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }
  .user-name,
  .group-name,
  .message p,
  .message-header strong {
    font-size: 12px;
  }
  .status-indicator,
  .timestamp {
    font-size: 10px;
  }
  .form-input,
  .form-button,
  .action-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>