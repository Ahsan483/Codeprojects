<script setup>
import { ref } from 'vue';

const profile = ref({
  name: 'Your Name',
  bio: 'A coding enthusiast passionate about building modern web applications',
  connections: 150,
  followers: 200,
  avatar: '😊',
  endorsements: [{ skill: 'Vue', count: 5 }],
  activity: [
    { type: 'post', content: 'Shared a new Vue tip!', timestamp: new Date(Date.now() - 3600000) },
    { type: 'project', content: 'Published a Ludo game project', timestamp: new Date(Date.now() - 7200000) }
  ],
  resume: null,
  skills: ['Vue', 'JavaScript', 'CSS'],
  location: 'Remote',
  website: 'https://yourportfolio.com'
});

const newSkill = ref('');

const endorseSkill = (skill) => {
  const endorsement = profile.value.endorsements.find(e => e.skill === skill);
  if (endorsement) {
    endorsement.count++;
  } else {
    profile.value.endorsements.push({ skill, count: 1 });
  }
  console.log(`Endorsed ${skill}!`);
};

const addConnection = () => {
  profile.value.connections++;
  console.log('Connection added!');
};

const followUser = () => {
  profile.value.followers++;
  console.log('Follower added!');
};

const uploadResume = (file) => {
  if (file) {
    profile.value.resume = URL.createObjectURL(file);
    console.log('Resume uploaded!');
  }
};

const addSkill = () => {
  if (newSkill.value.trim() && !profile.value.skills.includes(newSkill.value)) {
    profile.value.skills.push(newSkill.value.trim());
    newSkill.value = '';
    console.log('Skill added!');
  }
};

const viewActivity = (item) => {
  console.log(`Viewed ${item.type}: ${item.content}`);
};

const updateProfile = () => {
  console.log('Profile updated!');
};

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
  <div class="profile">
    <div class="hero-section">
      <h1 class="hero-title">Your Coding Profile</h1>
      <p class="hero-subtitle">Showcase your skills, projects, and connections.</p>
    </div>

    <div class="profile-card">
      <div class="profile-header">
        <span class="user-avatar">{{ profile.avatar }}</span>
        <div class="profile-info">
          <h2>{{ profile.name }}</h2>
          <p class="bio">{{ profile.bio }}</p>
          <p><strong>Location:</strong> {{ profile.location }}</p>
          <p><strong>Website:</strong> <a :href="profile.website" target="_blank" class="website-link">{{ profile.website }}</a></p>
          <div class="stats">
            <span><i class="fas fa-users"></i> {{ profile.connections }} Connections</span>
            <span><i class="fas fa-user-friends"></i> {{ profile.followers }} Followers</span>
          </div>
        </div>
      </div>
      <div class="profile-actions">
        <button @click="addConnection" class="action-button">
          <i class="fas fa-user-plus"></i> Add Connection
        </button>
        <button @click="followUser" class="action-button">
          <i class="fas fa-user-check"></i> Follow
        </button>
        <button @click="updateProfile" class="action-button">
          <i class="fas fa-edit"></i> Update Profile
        </button>
      </div>
    </div>

    <div class="skills-section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-list">
        <span v-for="skill in profile.skills" :key="skill" class="skill-badge">{{ skill }}</span>
      </div>
      <div class="skill-form">
        <input v-model="newSkill" placeholder="Add a new skill..." class="form-input" />
        <button @click="addSkill" class="action-button">
          <i class="fas fa-plus"></i> Add Skill
        </button>
      </div>
    </div>

    <div class="endorsements">
      <h2 class="section-title">Endorsements</h2>
      <div class="endorsement-list">
        <div v-for="(endorsement, index) in profile.endorsements" :key="index" class="endorsement">
          <span>{{ endorsement.skill }} ({{ endorsement.count }})</span>
          <button @click="endorseSkill(endorsement.skill)" class="action-button">
            <i class="fas fa-thumbs-up"></i> Endorse
          </button>
        </div>
      </div>
      <button @click="endorseSkill(prompt('Endorse skill:'))" class="action-button">
        <i class="fas fa-star"></i> Endorse New Skill
      </button>
    </div>

    <div class="activity-feed">
      <h2 class="section-title">Activity Feed</h2>
      <transition-group name="activity-list" tag="div" class="activity-grid">
        <div v-for="(item, index) in profile.activity" :key="index" class="activity-card" @click="viewActivity(item)">
          <span class="activity-type">{{ item.type.toUpperCase() }}</span>
          <p>{{ item.content }}</p>
          <span class="timestamp">{{ formatTime(item.timestamp) }}</span>
        </div>
      </transition-group>
    </div>

    <div class="resume">
      <h2 class="section-title">Resume</h2>
      <div class="resume-upload">
        <input type="file" accept=".pdf" @change="uploadResume($event.target.files[0])" class="form-file" />
        <a v-if="profile.resume" :href="profile.resume" download class="action-button">
          <i class="fas fa-download"></i> Download Resume
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.profile {
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
}

.profile-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.user-avatar {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.profile-info h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 10px;
}

.bio {
  font-size: 16px;
  color: #e5e7eb;
  margin-bottom: 10px;
}

.website-link {
  color: #60a5fa;
  text-decoration: none;
  transition: all 0.3s ease;
}

.website-link:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #94a3b8;
}

.profile-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #f9fafb;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f9fafb;
}

.skills-section {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
}

.skills-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.skill-badge {
  background: #22c55e;
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
}

.skill-form {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-input {
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #60a5fa;
}

.endorsements {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
}

.endorsement-list {
  display: grid;
  gap: 10px;
  margin-bottom: 15px;
}

.endorsement {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(59, 130, 246, 0.1);
  padding: 10px;
  border-radius: 8px;
}

.activity-feed {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
}

.activity-grid {
  display: grid;
  gap: 15px;
}

.activity-card {
  background: rgba(59, 130, 246, 0.1);
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-3px);
}

.activity-type {
  background: #f59e0b;
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 5px;
  display: inline-block;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
}

.resume {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
}

.resume-upload {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-file {
  color: #f9fafb;
}

.activity-list-enter-active,
.activity-list-leave-active {
  transition: all 0.5s ease;
}

.activity-list-enter-from,
.activity-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.light-mode .profile {
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
.light-mode .bio {
  color: #4b5563;
}

.light-mode .section-title {
  color: #1f2937;
}

.light-mode .profile-card,
.light-mode .skills-section,
.light-mode .endorsements,
.light-mode .activity-feed,
.light-mode .resume {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .form-input {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .form-input:focus {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .action-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .skill-badge {
  background: #22c55e;
  color: #fff;
}

.light-mode .website-link {
  color: #3b82f6;
}

.light-mode .website-link:hover {
  color: #2563eb;
}

.light-mode .stats,
.light-mode .timestamp {
  color: #64748b;
}

.light-mode .endorsement,
.light-mode .activity-card {
  background: rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .profile {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>