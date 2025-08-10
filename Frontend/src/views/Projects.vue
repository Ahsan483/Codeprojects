<script setup>
import { ref, watch, computed } from 'vue';

const projects = ref([
  {
    id: 1,
    user: 'User1',
    avatar: '👨',
    title: 'Ludo Game',
    description: 'A multiplayer Ludo game built with Vue.js and Node.js',
    details: 'Features real-time multiplayer, dice animation, and responsive design',
    github: 'https://github.com/user1/ludo-game',
    demo: 'https://ludo-game-demo.com',
    image: '',
    video: '',
    impressions: 10,
    clicks: 5,
    likes: 3,
    shares: 1,
    comments: [{ user: 'User2', text: 'Great work!', timestamp: new Date() }],
    status: 'Open',
    priority: 'High',
    tags: ['vue', 'nodejs', 'game'],
    version: '1.0.0',
    forks: 0,
    stars: 4,
    collaborators: [],
    timestamp: new Date(Date.now() - 3600000),
    techStack: ['Vue.js', 'Node.js', 'Socket.io', 'Tailwind CSS'],
    license: 'MIT'
  }
]);

const newProjectTitle = ref('');
const newProjectDesc = ref('');
const newProjectDetails = ref('');
const newProjectGithub = ref('');
const newProjectDemo = ref('');
const newProjectImage = ref(null);
const newProjectVideo = ref(null);
const newProjectPriority = ref('Medium');
const newProjectTags = ref('');
const newProjectTechStack = ref('');
const newProjectLicense = ref('MIT');
const searchQuery = ref('');
const sortOption = ref('newest');
const filteredProjects = ref(projects.value);

const createProject = () => {
  if (newProjectTitle.value.trim() && newProjectDesc.value.trim()) {
    const newProject = {
      id: projects.value.length + 1,
      user: 'You',
      avatar: '😊',
      title: newProjectTitle.value,
      description: newProjectDesc.value,
      details: newProjectDetails.value,
      github: newProjectGithub.value,
      demo: newProjectDemo.value,
      image: newProjectImage.value ? URL.createObjectURL(newProjectImage.value) : '',
      video: newProjectVideo.value ? URL.createObjectURL(newProjectVideo.value) : '',
      impressions: 0,
      clicks: 0,
      likes: 0,
      shares: 0,
      comments: [],
      status: 'Open',
      priority: newProjectPriority.value,
      tags: newProjectTags.value.split(',').map(tag => tag.trim()),
      version: '1.0.0',
      forks: 0,
      stars: 0,
      collaborators: [],
      timestamp: new Date(),
      techStack: newProjectTechStack.value.split(',').map(tech => tech.trim()),
      license: newProjectLicense.value
    };
    projects.value.unshift(newProject);
    resetForm();
    console.log('Project created!');
  }
};

const resetForm = () => {
  newProjectTitle.value = '';
  newProjectDesc.value = '';
  newProjectDetails.value = '';
  newProjectGithub.value = '';
  newProjectDemo.value = '';
  newProjectImage.value = null;
  newProjectVideo.value = null;
  newProjectPriority.value = 'Medium';
  newProjectTags.value = '';
  newProjectTechStack.value = '';
  newProjectLicense.value = 'MIT';
};

const viewProject = (project) => {
  project.impressions++;
};

const clickProject = (project) => {
  project.clicks++;
  console.log('Clicked!');
};

const likeProject = (project) => {
  project.likes++;
};

const shareProject = (project) => {
  project.shares++;
  console.log('Shared!');
};

const addComment = (project, commentText) => {
  if (commentText.trim()) {
    project.comments.push({ user: 'You', text: commentText, timestamp: new Date() });
  }
};

const updateStatus = (project, status) => {
  project.status = status;
  console.log(`Project status updated to ${status}!`);
};

const deleteProject = (projectId) => {
  projects.value = projects.value.filter(p => p.id !== projectId);
  console.log('Project deleted!');
};

const forkProject = (project) => {
  project.forks++;
  console.log('Project forked!');
};

const starProject = (project) => {
  project.stars++;
  console.log('Project starred!');
};

const inviteCollaborator = (project, user) => {
  if (user && !project.collaborators.includes(user)) {
    project.collaborators.push(user);
    console.log(`Invited ${user} to collaborate!`);
  }
};

const updateVersion = (project) => {
  const parts = project.version.split('.');
  parts[2] = parseInt(parts[2]) + 1;
  project.version = parts.join('.');
  console.log(`Version updated to ${project.version}!`);
};

const sortedFilteredProjects = computed(() => {
  let result = [...filteredProjects.value];
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortOption.value === 'likes') {
    result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (sortOption.value === 'stars') {
    result.sort((a, b) => b.stars - a.stars);
  }
  return result;
});

const filterProjects = () => {
  if (searchQuery.value.trim()) {
    filteredProjects.value = projects.value.filter(project =>
      project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  } else {
    filteredProjects.value = projects.value;
  }
};

const formatTime = (timestamp) => {
  const now = new Date();
  const diff = (now - new Date(timestamp)) / 1000;
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

watch(searchQuery, filterProjects);
watch(projects, filterProjects, { deep: true });
</script>

<template>
  <div class="projects">
    <div class="hero-section">
      <h1 class="hero-title">Coding Projects Showcase</h1>
      <p class="hero-subtitle">Discover and share innovative coding projects like a Ludo game, portfolio sites, and more.</p>
      <div class="search-sort">
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="Search by title, description, tags, or tech..." class="search-input" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <select v-model="sortOption" class="sort-select">
          <option value="newest">Newest</option>
          <option value="likes">Most Liked</option>
          <option value="stars">Most Starred</option>
        </select>
      </div>
    </div>

    <div class="project-form">
      <input v-model="newProjectTitle" placeholder="Project Title (e.g., Ludo Game)" class="form-input" />
      <textarea v-model="newProjectDesc" placeholder="Short description (e.g., A multiplayer Ludo game)" class="form-textarea"></textarea>
      <textarea v-model="newProjectDetails" placeholder="Detailed description (e.g., Features, tech used)" class="form-textarea"></textarea>
      <input v-model="newProjectGithub" placeholder="GitHub URL (e.g., https://github.com/user/ludo-game)" class="form-input" />
      <input v-model="newProjectDemo" placeholder="Demo URL (e.g., https://ludo-game-demo.com)" class="form-input" />
      <input v-model="newProjectTags" placeholder="Tags (e.g., vue, game, multiplayer)" class="form-input" />
      <input v-model="newProjectTechStack" placeholder="Tech Stack (e.g., Vue.js, Node.js, Socket.io)" class="form-input" />
      <select v-model="newProjectLicense" class="form-select">
        <option value="MIT">MIT</option>
        <option value="GPL-3.0">GPL-3.0</option>
        <option value="Apache-2.0">Apache-2.0</option>
      </select>
      <div class="file-inputs">
        <input type="file" accept="image/*" @change="e => newProjectImage = e.target.files[0]" class="form-file" />
        <input type="file" accept="video/*" @change="e => newProjectVideo = e.target.files[0]" class="form-file" />
      </div>
      <button @click="createProject" class="form-button">Create Project</button>
    </div>

    <transition-group name="project-list" tag="div" class="project-grid">
      <div v-for="project in sortedFilteredProjects" :key="project.id" class="project-card">
        <div class="project-header">
          <div class="user-info">
            <span class="user-avatar">{{ project.avatar }}</span>
            <div>
              <h3 class="project-title">{{ project.title }}</h3>
              <span class="user-name">by {{ project.user }}</span>
              <span class="timestamp">{{ formatTime(project.timestamp) }}</span>
            </div>
          </div>
          <button class="delete-btn" @click="deleteProject(project.id)" title="Delete Project">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="project-content">
          <p class="description"><strong>Description:</strong> {{ project.description }}</p>
          <p class="details"><strong>Details:</strong> {{ project.details }}</p>
          <div class="links">
            <a v-if="project.github" :href="project.github" target="_blank" class="github-link">
              <i class="fab fa-github"></i> GitHub
            </a>
            <a v-if="project.demo" :href="project.demo" target="_blank" class="demo-link">
              <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
          </div>
          <p><strong>Priority:</strong> {{ project.priority }}</p>
          <p><strong>Status:</strong> {{ project.status }}</p>
          <p><strong>Version:</strong> {{ project.version }}</p>
          <p><strong>License:</strong> {{ project.license }}</p>
          <p><strong>Tech Stack:</strong> {{ project.techStack.join(', ') }}</p>
          <p><strong>Tags:</strong> <span v-for="tag in project.tags" :key="tag" class="tag" @click="searchQuery = tag">#{{ tag }}</span></p>
          <p><strong>Collaborators:</strong> {{ project.collaborators.join(', ') || 'None' }}</p>
          <img v-if="project.image" :src="project.image" alt="Project Image" class="project-media" />
          <video v-if="project.video" :src="project.video" controls class="project-media"></video>
        </div>
        <div class="project-stats">
          <span><i class="fas fa-eye"></i> {{ project.impressions }} Impressions</span>
          <span><i class="fas fa-mouse-pointer"></i> {{ project.clicks }} Clicks</span>
          <span><i class="fas fa-heart"></i> {{ project.likes }} Likes</span>
          <span><i class="fas fa-share"></i> {{ project.shares }} Shares</span>
          <span><i class="fas fa-code-branch"></i> {{ project.forks }} Forks</span>
          <span><i class="fas fa-star"></i> {{ project.stars }} Stars</span>
        </div>
        <div class="project-actions">
          <button @click="viewProject(project)" title="View Project">
            <i class="fas fa-eye"></i> View
          </button>
          <button @click="clickProject(project)" title="Click Project">
            <i class="fas fa-mouse-pointer"></i> Click
          </button>
          <button @click="likeProject(project)" title="Like Project">
            <i class="fas fa-heart"></i> Like
          </button>
          <button @click="shareProject(project)" title="Share Project">
            <i class="fas fa-share"></i> Share
          </button>
          <button @click="forkProject(project)" title="Fork Project">
            <i class="fas fa-code-branch"></i> Fork
          </button>
          <button @click="starProject(project)" title="Star Project">
            <i class="fas fa-star"></i> Star
          </button>
          <button @click="updateVersion(project)" title="Update Version">
            <i class="fas fa-sync"></i> Update Version
          </button>
          <button @click="inviteCollaborator(project, prompt('Invite user:'))" title="Invite Collaborator">
            <i class="fas fa-user-plus"></i> Invite
          </button>
          <select @change="updateStatus(project, $event.target.value)" class="status-select">
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="comments">
          <h4>Comments</h4>
          <div v-for="(comment, index) in project.comments" :key="index" class="comment">
            <strong>{{ comment.user }}</strong>: {{ comment.text }}
            <span class="comment-timestamp">{{ formatTime(comment.timestamp) }}</span>
          </div>
          <div class="comment-input">
            <input type="text" placeholder="Add a comment..." @keyup.enter="addComment(project, $event.target.value); $event.target.value = ''" />
            <i class="fas fa-comment"></i>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.projects {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  color: #f9fafb;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  margin-bottom: 30px;
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

.search-sort {
  display: flex;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
  align-items: center;
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-input {
  width: 90%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #60a5fa;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.9);
  color: #f9fafb;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #60a5fa;
}

.sort-select {
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.9);
  color: #f9fafb;
  font-size: 14px;
  cursor: pointer;
}

/* Project Form */
.project-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
  transition: all 0.3s ease;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
  grid-column: span 2;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(15, 23, 42, 0.9);
}

.file-inputs {
  grid-column: span 2;
  display: flex;
  gap: 10px;
}

.form-file {
  color: #f9fafb;
}

.form-button {
  grid-column: span 2;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #f9fafb;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.form-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

/* Project Grid */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.project-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  font-size: 32px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.project-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.user-name {
  font-size: 14px;
  color: #e5e7eb;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #f9fafb;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.project-content {
  margin-bottom: 15px;
}

.description,
.details {
  font-size: 16px;
  line-height: 1.5;
  color: #e5e7eb;
}

.links {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.github-link,
.demo-link {
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.github-link:hover,
.demo-link:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.tag {
  color: #60a5fa;
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.3s ease;
}

.tag:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.project-media {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 10px 0;
}

.project-stats {
  font-size: 14px;
  color: #94a3b8;
  margin: 10px 0;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.project-actions {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.project-actions button,
.status-select {
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

.project-actions button:hover,
.status-select:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

.comments {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #3b82f6;
}

.comment {
  background: rgba(59, 130, 246, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  position: relative;
}

.comment-timestamp {
  font-size: 12px;
  color: #94a3b8;
  position: absolute;
  right: 10px;
  bottom: 5px;
}

.comment-input {
  position: relative;
}

.comment-input input {
  width: 90%;
  padding: 10px 40px 10px 12px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 14px;
}

.comment-input input:focus {
  outline: none;
  border-color: #60a5fa;
}

.comment-input i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #60a5fa;
}

/* Animations */
.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.5s ease;
}

.project-list-enter-from,
.project-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Light Mode */
.light-mode .projects {
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

.light-mode .hero-subtitle {
  color: #e5e7eb;
}

.light-mode .search-input,
.light-mode .form-input,
.light-mode .form-textarea,
.light-mode .form-select,
.light-mode .comment-input input {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .search-input:focus,
.light-mode .form-input:focus,
.light-mode .form-textarea:focus,
.light-mode .form-select:focus,
.light-mode .comment-input input:focus {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .project-form {
  background: rgba(243, 244, 246, 0.5);
}

.light-mode .form-button,
.light-mode .project-actions button,
.light-mode .status-select {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .form-button:hover,
.light-mode .project-actions button:hover,
.light-mode .status-select:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .project-card {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .user-name,
.light-mode .description,
.light-mode .details {
  color: #4b5563;
}

.light-mode .timestamp,
.light-mode .project-stats,
.light-mode .comment-timestamp {
  color: #64748b;
}

.light-mode .tag,
.light-mode .github-link,
.light-mode .demo-link {
  color: #3b82f6;
}

.light-mode .tag:hover,
.light-mode .github-link:hover,
.light-mode .demo-link:hover {
  color: #2563eb;
}

.light-mode .comment {
  background: rgba(59, 130, 246, 0.1);
}

.light-mode .comments {
  border-top: 1px solid #3b82f6;
}

.light-mode .delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #1f2937;
}

.light-mode .delete-btn:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

@media (max-width: 768px) {
  .projects {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .project-form {
    grid-template-columns: 1fr;
  }
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>