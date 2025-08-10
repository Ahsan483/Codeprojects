<script setup>
import { ref } from 'vue';

defineProps(['isDarkMode']);
defineEmits(['toggle-theme']);

const isNotificationsOpen = ref(false);
const notifications = ref([
  { id: 1, message: 'New project assigned!' },
  { id: 2, message: 'Order #123 updated.' },
  { id: 3, message: 'New course available.' }
]);

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-con">
      <div class="navbar-logo">Code Projects</div>
      <div class="navbar-list">
        <a href="#">Home1</a>
        <a href="#">Home2</a>
        <a href="#">Home3</a>
        <a href="#">Home4</a>
        <button @click="$emit('toggle-theme')" class="theme-toggle">
          {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <div class="notification-wrapper">
          <button class="notification-btn" @click="toggleNotifications">
            🔔
            <span class="notification-count">{{ notifications.length }}</span>
          </button>
          <div v-if="isNotificationsOpen" class="notification-dropdown">
            <div v-for="notification in notifications" :key="notification.id" class="notification-item">
              {{ notification.message }}
            </div>
          </div>
        </div>
        <button class="profile-btn">👤</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  padding: 15px 20px;
  background: linear-gradient(90deg, #1a2238 0%, #00c4b4 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin: 10px;
}

.navbar-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navbar-logo {
  font-size: 24px;
  font-weight: 700;
  color: #f59e0b;
  padding: 0 20px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
  color: #fb923c;
}

.navbar-list {
  display: flex;
  gap: 30px;
  align-items: center;
  margin-right: 30px;
}

.navbar-list a {
  color: #f59e0b;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.3s ease, color 0.3s ease;
}

.navbar-list a:hover {
  color: #fb923c;
  transform: scale(1.05);
}

.theme-toggle, .notification-btn, .profile-btn {
  background: transparent;
  border: 1px solid #f59e0b;
  color: #f59e0b;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover, .notification-btn:hover, .profile-btn:hover {
  background: #f59e0b;
  color: #ffffff;
  transform: scale(1.05);
}

.notification-wrapper {
  position: relative;
}

.notification-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: #ffffff;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
}

.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: #1a2238;
  border: 1px solid #00c4b4;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.notification-item {
  padding: 12px;
  color: #f59e0b;
  font-size: 14px;
  border-bottom: 1px solid #00c4b4;
  transition: background 0.3s ease;
}

.notification-item:hover {
  background: #00c4b4;
  color: #ffffff;
}

.notification-item:last-child {
  border-bottom: none;
}

/* Light mode styles */
.light-mode .navbar {
  background: linear-gradient(90deg, #f8fafc 0%, #e0f7fa 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.light-mode .navbar-logo,
.light-mode .navbar-list a,
.light-mode .theme-toggle,
.light-mode .notification-btn,
.light-mode .profile-btn {
  color: #b45309;
}

.light-mode .navbar-logo:hover,
.light-mode .navbar-list a:hover,
.light-mode .theme-toggle:hover,
.light-mode .notification-btn:hover,
.light-mode .profile-btn:hover {
  color: #ffffff;
  background: #b45309;
}

.light-mode .notification-dropdown {
  background: #f8fafc;
  border: 1px solid #4b9cd3;
}

.light-mode .notification-item {
  color: #b45309;
  border-bottom: 1px solid #4b9cd3;
}

.light-mode .notification-item:hover {
  background: #4b9cd3;
  color: #ffffff;
}
</style>