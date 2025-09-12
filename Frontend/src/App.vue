<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import ChatBox from './components/ChatBox.vue';

const isDarkMode = ref(true);
const showAuthPopup = ref(false);
const isLoginForm = ref(true); // Toggle between login and signup forms
const email = ref('');
const password = ref('');
const username = ref('');
const error = ref('');
const user = ref(null); // Store user data
const router = useRouter();

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme');
  isDarkMode.value = savedTheme ? JSON.parse(savedTheme) : true;
  document.body.classList.toggle('light-mode', !isDarkMode.value);

  // Check for existing auth token
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    try {
      // Verify token with backend
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      user.value = response.data; // Store user data
      console.log('Auto-logged in:', user.value);
      showAuthPopup.value = false;
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
      showAuthPopup.value = true;
    }
  } else {
    showAuthPopup.value = true;
  }
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', JSON.stringify(isDarkMode.value));
  document.body.classList.toggle('light-mode', !isDarkMode.value);
};

const toggleForm = () => {
  isLoginForm.value = !isLoginForm.value;
  error.value = ''; // Clear error on form toggle
};

const handleAuth = async () => {
  try {
    const url = isLoginForm.value ? '/login' : '/signup';
    const payload = isLoginForm.value
      ? { email: email.value, password: password.value }
      : { username: username.value, email: email.value, password: password.value };

    const response = await axios.post(`http://localhost:5000/api/auth${url}`, payload);
    localStorage.setItem('authToken', response.data.token);
    user.value = response.data.user; // Store user data
    showAuthPopup.value = false;
    error.value = '';
    // Reset form fields
    email.value = '';
    password.value = '';
    username.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || (isLoginForm.value ? 'Login failed' : 'Signup failed');
  }
};

const handleLogout = () => {
  localStorage.removeItem('authToken');
  user.value = null;
  showAuthPopup.value = true;
  router.push('/');
};
</script>

<template>
  <div class="app-container" :class="{ 'light-mode': !isDarkMode }">
    <div class="content-wrapper" :class="{ 'blurred': showAuthPopup }">
      <Sidebar :isAuthenticated="!!user" @logout="handleLogout" />
      <div class="main-container">
        <Navbar :isDarkMode="isDarkMode" :user="user" @toggle-theme="toggleTheme" />
        <router-view />
        <ChatBox :isAuthenticated="!!user" />
      </div>
    </div>

    <!-- Auth Popup -->
    <div v-if="showAuthPopup" class="auth-popup">
      <div class="popup-content">
        <h2>{{ isLoginForm ? 'Sign In' : 'Sign Up' }}</h2>
        <form @submit.prevent="handleAuth">
          <input
            v-if="!isLoginForm"
            v-model="username"
            type="text"
            placeholder="Username"
            required
          />
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <button type="submit">{{ isLoginForm ? 'Sign In' : 'Sign Up' }}</button>
          <p v-if="error" class="error">{{ error }}</p>
          <p>
            {{ isLoginForm ? 'Need an account?' : 'Already have an account?' }}
            <button type="button" class="toggle-link" @click="toggleForm">
              {{ isLoginForm ? 'Sign Up' : 'Sign In' }}
            </button>
          </p>
        </form>
      </div>
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

.content-wrapper {
  display: flex;
  width: 100%;
  position: relative;
}

.content-wrapper.blurred {
  filter: blur(5px);
  pointer-events: none; /* Disable clicks on background */
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

.auth-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: black;
  width: 100%;
  max-width: 400px;
}

.popup-content input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.popup-content button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-content button[type="submit"] {
  background: #1e40af;
  color: white;
}

.popup-content .toggle-link {
  background: none;
  color: #1e40af;
  text-decoration: underline;
}

.error {
  color: red;
}
</style>