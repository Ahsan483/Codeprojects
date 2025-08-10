<script setup>
import { ref, computed } from 'vue';

const profileName = ref('Your Name');
const profileBio = ref('Your bio here');
const profileAvatar = ref(null);
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const privacy = ref('Public');
const notificationsEnabled = ref(true);
const twoFactorEnabled = ref(false);
const customTheme = ref('Default');
const accountActivity = ref([
  { action: 'Profile updated', timestamp: new Date(Date.now() - 3600000) },
  { action: 'Logged in', timestamp: new Date(Date.now() - 7200000) }
]);

const saveSettings = () => {
  if (profileName.value.trim()) {
    accountActivity.value.unshift({ action: 'Profile updated', timestamp: new Date() });
    console.log('Settings saved!');
  }
};

const updateAvatar = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileAvatar.value = URL.createObjectURL(file);
    accountActivity.value.unshift({ action: 'Avatar updated', timestamp: new Date() });
    console.log('Avatar updated!');
  }
};

const changePassword = () => {
  if (currentPassword.value && newPassword.value && confirmNewPassword.value) {
    if (newPassword.value === confirmNewPassword.value) {
      accountActivity.value.unshift({ action: 'Password changed', timestamp: new Date() });
      console.log('Password changed!');
      currentPassword.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';
    } else {
      console.log('New passwords do not match!');
    }
  }
};

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    console.log('Account deleted!');
  }
};

const updatePrivacy = (level) => {
  privacy.value = level;
  accountActivity.value.unshift({ action: `Privacy set to ${level}`, timestamp: new Date() });
  console.log('Privacy updated!');
};

const toggleNotifications = () => {
  notificationsEnabled.value = !notificationsEnabled.value;
  accountActivity.value.unshift({ action: `Notifications ${notificationsEnabled.value ? 'enabled' : 'disabled'}`, timestamp: new Date() });
  console.log('Notifications toggled!');
};

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value;
  accountActivity.value.unshift({ action: `Two-factor authentication ${twoFactorEnabled.value ? 'enabled' : 'disabled'}`, timestamp: new Date() });
  console.log('Two-factor authentication toggled!');
};

const chooseTheme = (theme) => {
  customTheme.value = theme;
  accountActivity.value.unshift({ action: `Theme set to ${theme}`, timestamp: new Date() });
  console.log('Theme updated!');
};

const formatTime = (timestamp) => {
  const now = new Date();
  const diff = (now - new Date(timestamp)) / 1000;
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const themePreview = computed(() => {
  if (customTheme.value === 'Dark') {
    return 'A sleek dark mode with vibrant gradients for a modern look.';
  } else if (customTheme.value === 'Light') {
    return 'A clean light mode with soft colors for a bright experience.';
  } else {
    return 'The default theme with a balanced dark and light aesthetic.';
  }
});
</script>

<template>
  <div class="settings">
    <div class="hero-section">
      <h1 class="hero-title">Settings</h1>
      <p class="hero-subtitle">Customize your profile, privacy, and preferences.</p>
    </div>

    <div class="settings-section">
      <h3 class="section-title">Profile</h3>
      <div class="profile-edit">
        <div class="avatar-container">
          <img v-if="profileAvatar" :src="profileAvatar" alt="Profile Avatar" class="avatar-preview" />
          <span v-else class="avatar-placeholder"><i class="fas fa-user"></i></span>
          <input type="file" accept="image/*" @change="updateAvatar" class="form-file" />
        </div>
        <input v-model="profileName" placeholder="Name" class="form-input" />
        <textarea v-model="profileBio" placeholder="Bio" class="form-textarea"></textarea>
        <button @click="saveSettings" class="form-button">
          <i class="fas fa-save"></i> Save Profile
        </button>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">Security</h3>
      <div class="security-settings">
        <div class="password-form">
          <input v-model="currentPassword" type="password" placeholder="Current Password" class="form-input" />
          <input v-model="newPassword" type="password" placeholder="New Password" class="form-input" />
          <input v-model="confirmNewPassword" type="password" placeholder="Confirm New Password" class="form-input" />
          <button @click="changePassword" class="form-button">
            <i class="fas fa-lock"></i> Change Password
          </button>
        </div>
        <label class="two-factor-toggle">
          <input type="checkbox" v-model="twoFactorEnabled" @change="toggleTwoFactor" />
          Enable Two-Factor Authentication
        </label>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">Privacy</h3>
      <div class="privacy-settings">
        <select v-model="privacy" @change="updatePrivacy(privacy)" class="form-select">
          <option value="Public">Public</option>
          <option value="Friends">Friends Only</option>
          <option value="Private">Private</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">Notifications</h3>
      <div class="notification-settings">
        <label class="notification-toggle">
          <input type="checkbox" v-model="notificationsEnabled" @change="toggleNotifications" />
          Enable Notifications
        </label>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">Theme</h3>
      <div class="theme-settings">
        <select v-model="customTheme" class="form-select">
          <option value="Default">Default</option>
          <option value="Dark">Dark</option>
          <option value="Light">Light</option>
        </select>
        <p class="theme-preview">{{ themePreview }}</p>
        <button @click="chooseTheme(customTheme)" class="form-button">
          <i class="fas fa-paint-brush"></i> Apply Theme
        </button>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">Account Activity</h3>
      <div class="activity-log">
        <div v-if="accountActivity.length === 0" class="no-content">No activity yet</div>
        <div v-for="(activity, index) in accountActivity" :key="index" class="activity-item">
          <p>{{ activity.action }} <span class="timestamp">{{ formatTime(activity.timestamp) }}</span></p>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">Danger Zone</h3>
      <button class="delete-account" @click="deleteAccount">
        <i class="fas fa-trash"></i> Delete Account
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.settings {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  color: #f9fafb;
  display: grid;
  gap: 30px;
}

.hero-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #f9fafb, #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  color: #e5e7eb;
  margin-bottom: 20px;
}

.settings-section {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #f9fafb;
}

.profile-edit {
  display: grid;
  gap: 15px;
  max-width: 600px;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #f9fafb;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 14px;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(15, 23, 42, 0.9);
}

.form-file {
  color: #f9fafb;
}

.form-button,
.delete-account {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #f9fafb;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.form-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

.delete-account {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.delete-account:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
  transform: translateY(-2px);
}

.security-settings,
.privacy-settings,
.notification-settings,
.theme-settings {
  display: grid;
  gap: 15px;
}

.password-form {
  display: grid;
  gap: 10px;
}

.notification-toggle,
.two-factor-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.notification-toggle input,
.two-factor-toggle input {
  cursor: pointer;
}

.theme-preview {
  font-size: 14px;
  color: #e5e7eb;
  margin: 10px 0;
}

.activity-log {
  display: grid;
  gap: 10px;
}

.activity-item {
  background: rgba(59, 130, 246, 0.1);
  padding: 10px;
  border-radius: 8px;
  position: relative;
}

.activity-item p {
  font-size: 14px;
  margin: 0;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
  position: absolute;
  right: 10px;
  top: 10px;
}

.no-content {
  color: #94a3b8;
  font-size: 14px;
}

.light-mode .settings {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.9), rgba(191, 219, 254, 0.8));
  color: #1f2937;
}

.light-mode .hero-section {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.light-mode .hero-title {
  background: linear-gradient(45deg, #1f2937, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.light-mode .hero-subtitle,
.light-mode .theme-preview,
.light-mode .section-title,
.light-mode .activity-item p {
  color: #4b5563;
}

.light-mode .settings-section {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .form-input,
.light-mode .form-textarea,
.light-mode .form-select {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .form-input:focus,
.light-mode .form-textarea:focus,
.light-mode .form-select:focus {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .form-button,
.light-mode .delete-account {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .form-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .delete-account {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.light-mode .delete-account:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.light-mode .timestamp,
.light-mode .no-content {
  color: #64748b;
}

.light-mode .activity-item {
  background: rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .settings {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .avatar-preview,
  .avatar-placeholder {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
}
</style>