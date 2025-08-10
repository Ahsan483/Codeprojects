<script setup>
import { ref, computed } from 'vue';

const requests = ref([
  {
    id: 1,
    user: 'User1',
    avatar: '👨',
    title: 'Need a Vue Dashboard',
    description: 'A dashboard for project tracking',
    details: 'Should include charts, user authentication, and responsive design',
    image: '',
    video: '',
    impressions: 8,
    clicks: 3,
    comments: [{ user: 'User2', text: 'Sounds interesting!', timestamp: new Date(Date.now() - 3600000) }],
    status: 'Open',
    priority: 'High',
    deadline: '2025-09-01',
    bids: [{ user: 'User3', amount: 200, timestamp: new Date(Date.now() - 7200000) }],
    tags: ['vue', 'dashboard'],
    timestamp: new Date(Date.now() - 10800000)
  }
]);

const newRequestTitle = ref('');
const newRequestDesc = ref('');
const newRequestDetails = ref('');
const newRequestImage = ref(null);
const newRequestVideo = ref(null);
const newRequestPriority = ref('Medium');
const newRequestDeadline = ref('');
const newRequestTags = ref('');
const searchQuery = ref('');
const sortOption = ref('newest');

const createRequest = () => {
  if (newRequestTitle.value.trim() && newRequestDesc.value.trim()) {
    requests.value.unshift({
      id: requests.value.length + 1,
      user: 'You',
      avatar: '😊',
      title: newRequestTitle.value,
      description: newRequestDesc.value,
      details: newRequestDetails.value,
      image: newRequestImage.value ? URL.createObjectURL(newRequestImage.value) : '',
      video: newRequestVideo.value ? URL.createObjectURL(newRequestVideo.value) : '',
      impressions: 0,
      clicks: 0,
      comments: [],
      status: 'Open',
      priority: newRequestPriority.value,
      deadline: newRequestDeadline.value,
      bids: [],
      tags: newRequestTags.value.split(',').map(tag => tag.trim()),
      timestamp: new Date()
    });
    newRequestTitle.value = '';
    newRequestDesc.value = '';
    newRequestDetails.value = '';
    newRequestImage.value = null;
    newRequestVideo.value = null;
    newRequestPriority.value = 'Medium';
    newRequestDeadline.value = '';
    newRequestTags.value = '';
    console.log('Request submitted!');
  }
};

const viewRequest = (request) => {
  request.impressions++;
};

const clickRequest = (request) => {
  request.clicks++;
  console.log('Clicked!');
};

const addComment = (request, commentText) => {
  if (commentText.trim()) {
    request.comments.push({ user: 'You', text: commentText, timestamp: new Date() });
  }
};

const updateStatus = (request, status) => {
  request.status = status;
  console.log(`Request status updated to ${status}!`);
};

const placeBid = (request, amount) => {
  if (amount && !isNaN(amount) && amount > 0) {
    request.bids.push({ user: 'You', amount, timestamp: new Date() });
    console.log(`Bid placed for $${amount}!`);
  }
};

const acceptBid = (request, bid) => {
  request.status = 'In Progress';
  console.log(`Bid by ${bid.user} accepted!`);
};

const deleteRequest = (requestId) => {
  requests.value = requests.value.filter(r => r.id !== requestId);
  console.log('Request deleted!');
};

const setDeadline = (request, deadline) => {
  if (deadline) {
    request.deadline = deadline;
    console.log(`Deadline set to ${deadline}!`);
  }
};

const filteredRequests = computed(() => {
  let result = requests.value.filter(request =>
    request.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    request.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortOption.value === 'bids') {
    result.sort((a, b) => b.bids.length - a.bids.length);
  }
  return result;
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
  <div class="requests">
    <div class="hero-section">
      <h1 class="hero-title">Project Requests</h1>
      <p class="hero-subtitle">Find or post coding project requests like on Upwork.</p>
      <div class="search-sort">
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="Search requests by title, description, or tags..." class="search-input" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <select v-model="sortOption" class="sort-select">
          <option value="newest">Newest</option>
          <option value="bids">Most Bids</option>
        </select>
      </div>
    </div>

    <div class="request-form">
      <input v-model="newRequestTitle" placeholder="Request Title (e.g., Vue Dashboard)" class="form-input" />
      <textarea v-model="newRequestDesc" placeholder="Short description" class="form-textarea"></textarea>
      <textarea v-model="newRequestDetails" placeholder="Detailed requirements" class="form-textarea"></textarea>
      <input v-model="newRequestTags" placeholder="Tags (e.g., vue, dashboard)" class="form-input" />
      <select v-model="newRequestPriority" class="form-select">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input type="date" v-model="newRequestDeadline" class="form-input" />
      <div class="file-inputs">
        <input type="file" accept="image/*" @change="e => newRequestImage = e.target.files[0]" class="form-file" />
        <input type="file" accept="video/*" @change="e => newRequestVideo = e.target.files[0]" class="form-file" />
      </div>
      <button @click="createRequest" class="form-button">
        <i class="fas fa-paper-plane"></i> Submit Request
      </button>
    </div>

    <transition-group name="request-list" tag="div" class="request-grid">
      <div v-for="request in filteredRequests" :key="request.id" class="request-card">
        <div class="card-header">
          <span class="user-avatar">{{ request.avatar }}</span>
          <div class="user-info">
            <h3>{{ request.title }}</h3>
            <span class="user-name">by {{ request.user }}</span>
            <span class="timestamp">{{ formatTime(request.timestamp) }}</span>
          </div>
          <button class="delete-btn" @click="deleteRequest(request.id)" title="Delete Request">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="card-content">
          <p><strong>Description:</strong> {{ request.description }}</p>
          <p><strong>Details:</strong> {{ request.details }}</p>
          <p><strong>Priority:</strong> {{ request.priority }}</p>
          <p><strong>Status:</strong> {{ request.status }}</p>
          <p><strong>Deadline:</strong> {{ request.deadline }}</p>
          <p><strong>Tags:</strong> <span v-for="tag in request.tags" :key="tag" class="tag" @click="searchQuery = tag">#{{ tag }}</span></p>
          <img v-if="request.image" :src="request.image" alt="Request Image" class="request-media" />
          <video v-if="request.video" :src="request.video" controls class="request-media"></video>
        </div>
        <div class="card-stats">
          <span><i class="fas fa-eye"></i> {{ request.impressions }} Impressions</span>
          <span><i class="fas fa-mouse-pointer"></i> {{ request.clicks }} Clicks</span>
          <span><i class="fas fa-gavel"></i> {{ request.bids.length }} Bids</span>
        </div>
        <div class="card-actions">
          <button @click="viewRequest(request)" class="action-button">
            <i class="fas fa-eye"></i> View
          </button>
          <button @click="clickRequest(request)" class="action-button">
            <i class="fas fa-mouse-pointer"></i> Click
          </button>
          <button @click="placeBid(request, prompt('Bid amount:'))" class="action-button">
            <i class="fas fa-gavel"></i> Place Bid
          </button>
          <select @change="updateStatus(request, $event.target.value)" class="status-select">
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <button @click="setDeadline(request, prompt('New deadline (YYYY-MM-DD):'))" class="action-button">
            <i class="fas fa-calendar-alt"></i> Set Deadline
          </button>
        </div>
        <div class="bids">
          <h4>Bids</h4>
          <div v-for="(bid, index) in request.bids" :key="index" class="bid">
            <strong>{{ bid.user }}:</strong> ${{ bid.amount }}
            <span class="bid-timestamp">{{ formatTime(bid.timestamp) }}</span>
            <button @click="acceptBid(request, bid)" class="action-button">
              <i class="fas fa-check"></i> Accept
            </button>
          </div>
        </div>
        <div class="comments">
          <h4>Comments</h4>
          <div v-for="(comment, index) in request.comments" :key="index" class="comment">
            <strong>{{ comment.user }}:</strong> {{ comment.text }}
            <span class="comment-timestamp">{{ formatTime(comment.timestamp) }}</span>
          </div>
          <div class="comment-input">
            <input type="text" placeholder="Add a comment..." @keyup.enter="addComment(request, $event.target.value); $event.target.value = ''" />
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

.requests {
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

.sort-select,
.status-select,
.form-select {
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.9);
  color: #f9fafb;
  font-size: 14px;
  cursor: pointer;
}

.request-form {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
  display: grid;
  gap: 15px;
}

.form-input,
.form-textarea {
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

.file-inputs {
  display: flex;
  gap: 10px;
}

.form-file {
  color: #f9fafb;
}

.form-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #f9fafb;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.form-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

.request-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.request-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.request-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  position: relative;
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

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 5px;
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
  position: absolute;
  right: 0;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.card-content {
  margin-bottom: 15px;
}

.card-content p {
  font-size: 14px;
  margin: 5px 0;
  color: #e5e7eb;
}

.tag {
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.tag:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.request-media {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

.card-stats {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
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

.bids {
  border-top: 1px solid #3b82f6;
  padding-top: 15px;
  margin-top: 15px;
}

.bid {
  background: rgba(59, 130, 246, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.bid-timestamp {
  font-size: 12px;
  color: #94a3b8;
  position: absolute;
  right: 10px;
  bottom: 5px;
}

.comments {
  border-top: 1px solid #3b82f6;
  padding-top: 15px;
  margin-top: 15px;
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

.request-list-enter-active,
.request-list-leave-active {
  transition: all 0.5s ease;
}

.request-list-enter-from,
.request-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.light-mode .requests {
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
.light-mode .card-content p,
.light-mode .user-name {
  color: #4b5563;
}

.light-mode .search-input,
.light-mode .form-input,
.light-mode .form-textarea,
.light-mode .comment-input input {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .search-input:focus,
.light-mode .form-input:focus,
.light-mode .form-textarea:focus,
.light-mode .comment-input input:focus {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .sort-select,
.light-mode .status-select,
.light-mode .form-select {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
}

.light-mode .request-form,
.light-mode .request-card {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .action-button,
.light-mode .form-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .action-button:hover,
.light-mode .form-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #1f2937;
}

.light-mode .delete-btn:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.light-mode .timestamp,
.light-mode .bid-timestamp,
.light-mode .comment-timestamp,
.light-mode .card-stats {
  color: #64748b;
}

.light-mode .tag {
  color: #3b82f6;
}

.light-mode .tag:hover {
  color: #2563eb;
}

.light-mode .bid,
.light-mode .comment {
  background: rgba(59, 130, 246, 0.1);
}

.light-mode .bids,
.light-mode .comments {
  border-top: 1px solid #3b82f6;
}

@media (max-width: 768px) {
  .requests {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .request-grid {
    grid-template-columns: 1fr;
  }
}
</style>