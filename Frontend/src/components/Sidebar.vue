<template>
  <aside class="sidebar">
    <div class="sidebar-logo">Code Projects</div>
    <ul class="sidebar-list">
      <li class="sidebar-item">
        <router-link :to="isAuthenticated ? '/' : '#'">
          <i class="fas fa-home"></i> Home
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="isAuthenticated ? '/projects' : '#'">
          <i class="fas fa-code"></i> Your Projects
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="isAuthenticated ? '/orders' : '#'">
          <i class="fas fa-shopping-cart"></i> Orders
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="isAuthenticated ? '/posts' : '#'">
          <i class="fas fa-upload"></i> Upload
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="isAuthenticated ? '/messages' : '#'">
          <i class="fas fa-message"></i> Messages
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="isAuthenticated ? '/settings' : '#'">
          <i class="fas fa-cog"></i> Settings
        </router-link>
      </li>
      <li v-if="isAuthenticated" class="sidebar-item">
        <a href="#" @click.prevent="$emit('logout')">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  isAuthenticated: Boolean,
});
defineEmits(['logout']);
</script>

<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  width: 250px;
  background: linear-gradient(180deg, #0f172a 0%, #1e40af 100%);
  border-right: 1px solid #3b82f6;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-logo {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  padding: 20px;
  background-image: linear-gradient(0.15turn, #ffffff, #dfc327, #00ffaa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: background-image 0.3s ease;
}

.sidebar-logo:hover {
  background-image: linear-gradient(0.25turn, #3b82f6, #ebf8e1, #f69d3c);
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  padding: 15px 20px;
  transition: background 0.3s ease;
}

.sidebar-item a {
  color: #f9fafb;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.sidebar-item a:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding-left: 10px;
  transform: translateX(5px);
}

.sidebar-item a[href='#'] {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none; /* Disable clicks for unauthenticated users */
}

/* Light mode styles */
.light-mode .sidebar {
  background: linear-gradient(180deg, #f9fafb 0%, #dbeafe 100%);
  border-right: 1px solid #3b82f6;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
}

.light-mode .sidebar-logo,
.light-mode .sidebar-item a {
  color: #1f2937;
}

.light-mode .sidebar-item a:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #3b82f6;
  }
}
</style>