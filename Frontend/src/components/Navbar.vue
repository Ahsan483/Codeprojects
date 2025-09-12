<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isDarkMode: Boolean,
  user: Object,
});
const emit = defineEmits(['toggle-theme', 'logout']);

const isNotificationsOpen = ref(false);
const notifications = ref([
  { id: 1, message: 'New project assigned!', read: false },
  { id: 2, message: 'Order #123 updated.', read: false },
  { id: 3, message: 'New course available.', read: false },
]);

const toggleNotifications = () => {
  if (props.user) {
    isNotificationsOpen.value = !isNotificationsOpen.value;
  }
};

const markRead = (notification) => {
  if (props.user) {
    notification.read = true;
  }
};

const globalSearch = ref('');
const router = useRouter();
const performSearch = () => {
  if (props.user && globalSearch.value.trim()) {
    console.log(`Searching for ${globalSearch.value} across app!`);
    router.push({ path: '/', query: { search: globalSearch.value } });
  }
};

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  if (props.user) {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }
};

const handleLogout = () => {
  emit('logout');
  isMobileMenuOpen.value = false;
  isNotificationsOpen.value = false;
};
</script>

<template>
  <nav class="navbar" :class="{ 'light-mode': !isDarkMode }">
    <div class="navbar-con">
      <div class="navbar-search">
        <input
          v-model="globalSearch"
          placeholder="Search posts, projects..."
          @keyup.enter="performSearch"
          :disabled="!user"
        />
        <button @click="performSearch" :disabled="!user">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div class="navbar-list desktop">
        <button @click="emit('toggle-theme')" class="theme-toggle">
          <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
          {{ isDarkMode ? 'Light' : 'Dark' }}
        </button>
        <div class="notification-wrapper">
          <button class="notification-btn" @click="toggleNotifications" :disabled="!user">
            <i class="fas fa-bell"></i>
            <span class="notification-count">{{ notifications.filter(n => !n.read).length }}</span>
          </button>
          <div v-if="isNotificationsOpen" class="notification-dropdown">
            <div v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ read: notification.read }">
              {{ notification.message }}
              <button @click="markRead(notification)" :disabled="!user">Mark Read</button>
            </div>
          </div>
        </div>
        <router-link :to="user ? '/profile' : '#'" class="profile-btn">
          <i class="fas fa-user-circle"></i>
          {{ user ? user.username : 'Guest' }}
        </router-link>
        <button v-if="user" @click="handleLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      <button class="mobile-toggle" @click="toggleMobileMenu" :disabled="!user">
        <i class="fas fa-bars"></i>
      </button>
      <div v-if="isMobileMenuOpen" class="navbar-list mobile">
        <router-link :to="user ? '/' : '#'" @click="toggleMobileMenu">
          <i class="fas fa-home"></i> Home
        </router-link>
        <router-link :to="user ? '/posts' : '#'" @click="toggleMobileMenu">
          <i class="fas fa-scroll"></i> Posts
        </router-link>
        <router-link :to="user ? '/projects' : '#'" @click="toggleMobileMenu">
          <i class="fas fa-code"></i> Projects
        </router-link>
        <router-link :to="user ? '/profile' : '#'" @click="toggleMobileMenu">
          <i class="fas fa-user"></i>
          {{ user ? user.username : 'Guest' }}
        </router-link>
        <button @click="emit('toggle-theme'); toggleMobileMenu()" class="theme-toggle">
          <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
          {{ isDarkMode ? 'Light' : 'Dark' }}
        </button>
        <div class="notification-wrapper">
          <button class="notification-btn" @click="toggleNotifications" @click.stop :disabled="!user">
            <i class="fas fa-bell"></i>
            <span class="notification-count">{{ notifications.filter(n => !n.read).length }}</span>
          </button>
          <div v-if="isNotificationsOpen" class="notification-dropdown" @click.stop>
            <div v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ read: notification.read }">
              {{ notification.message }}
              <button @click="markRead(notification)" :disabled="!user">Mark Read</button>
            </div>
          </div>
        </div>
        <button v-if="user" @click="handleLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  padding: 15px 20px;
  background: linear-gradient(90deg, #0f172a 0%, #1e40af 100%);
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  position: fixed;
  top: 0;
  z-index: 99;
}

.navbar-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.navbar-search {
  flex: 1;
  display: flex;
  gap: 10px;
  max-width: 400px;
}

.navbar-search input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.7);
  color: #f9fafb;
  transition: all 0.3s ease;
}

.navbar-search input:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(30, 41, 59, 0.9);
}

.navbar-search input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.navbar-search button {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #f9fafb;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-search button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.navbar-search button:hover:not(:disabled) {
  background: linear-gradient(135deg, #f87171, #ef4444);
  transform: translateY(-2px);
}

.navbar-list {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-right: 50px;
}

.navbar-list a {
  color: #f9fafb;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.navbar-list a[href='#'] {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

.navbar-list a:hover:not([href='#']) {
  color: #3b82f6;
  transform: scale(1.05);
}

.theme-toggle, .notification-btn, .profile-btn, .logout-btn {
  background: transparent;
  border: 1px solid #ef4444;
  color: #f9fafb;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.theme-toggle:hover, .notification-btn:hover, .profile-btn:hover, .logout-btn:hover {
  background: #3b82f6;
  color: #f9fafb;
  transform: scale(1.05);
}

.notification-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.notification-wrapper {
  position: relative;
}

.notification-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: #f9fafb;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 12px;
}

.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: #1e293b;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 10;
  animation: fadeIn 0.3s ease;
}

.notification-item {
  padding: 12px;
  color: #f9fafb;
  font-size: 14px;
  border-bottom: 1px solid #3b82f6;
  transition: background 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-item.read {
  opacity: 0.6;
}

.notification-item:hover {
  background: #3b82f6;
  color: #f9fafb;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  color: #f9fafb;
  font-size: 24px;
  cursor: pointer;
}

.mobile-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.navbar-list.mobile {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  background: #0f172a;
  padding: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .navbar-list.desktop {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
  .navbar-list.mobile {
    display: flex;
  }
}

/* Light mode styles */
.light-mode .navbar {
  background: linear-gradient(90deg, #f9fafb 0%, #dbeafe 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.light-mode .navbar-list a,
.light-mode .theme-toggle,
.light-mode .notification-btn,
.light-mode .profile-btn,
.light-mode .logout-btn {
  color: #1f2937;
}

.light-mode .navbar-search input {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .navbar-search button {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #1f2937;
}

.light-mode .navbar-list a:hover:not([href='#']),
.light-mode .theme-toggle:hover,
.light-mode .notification-btn:hover:not(:disabled),
.light-mode .profile-btn:hover,
.light-mode .logout-btn:hover {
  color: #1f2937;
  background: #3b82f6;
}

.light-mode .notification-dropdown {
  background: #f9fafb;
  border: 1px solid #3b82f6;
}

.light-mode .notification-item {
  color: #1f2937;
  border-bottom: 1px solid #3b82f6;
}

.light-mode .notification-item:hover {
  background: #3b82f6;
  color: #f9fafb;
}

.light-mode .mobile-toggle {
  color: #1f2937;
}

.light-mode .navbar-list.mobile {
  background: #f9fafb;
}
</style>