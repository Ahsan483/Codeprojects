<script setup>
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import ChatBox from './components/ChatBox.vue';

// Theme toggle state
const isDarkMode = ref(true);

// Toggle theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('light-mode', !isDarkMode.value);
};
</script>

<template>
  <div class="app-container" :class="{ 'light-mode': !isDarkMode }">
    <Sidebar />
    <div class="main-container">
      <Navbar :isDarkMode="isDarkMode" @toggle-theme="toggleTheme" />
      <ChatBox />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
  display: flex;
  background: linear-gradient(135deg, #1a2238 0%, #0a3d62 100%);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.main-container {
  flex: 1;
  padding-left: 250px;
}

/* Light mode styles */
.light-mode {
  background: linear-gradient(135deg, #f8fafc 0%, #e0f7fa 100%);
}
</style>