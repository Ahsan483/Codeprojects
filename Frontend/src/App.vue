<!-- App.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import ChatBox from './components/ChatBox.vue';

const isDarkMode = ref(true);

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDarkMode.value = savedTheme ? JSON.parse(savedTheme) : true;
  document.body.classList.toggle('light-mode', !isDarkMode.value);
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', JSON.stringify(isDarkMode.value));
  document.body.classList.toggle('light-mode', !isDarkMode.value);
};

const router = useRouter();
router.beforeEach((to, from, next) => {
  next();
});
</script>

<template>
  <div class="app-container" :class="{ 'light-mode': !isDarkMode }">
    <Sidebar />
    <div class="main-container">
      <Navbar :isDarkMode="isDarkMode" @toggle-theme="toggleTheme" />
      <router-view />
      <ChatBox />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.app-container {
  display: flex;
  background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.main-container {
  flex: 1;
  padding-left: 250px;
  padding-top: 80px;
}

@media (max-width: 768px) {
  .main-container {
    padding-left: 0;
    padding-top: 60px;
  }
}

/* Light mode styles */
.light-mode {
}
</style>