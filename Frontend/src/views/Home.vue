<script setup>
import { ref, computed } from 'vue';

const feed = ref([
  { 
    id: 1,
    type: 'post', 
    user: 'User1', 
    avatar: '👨', 
    content: 'Just launched my new portfolio site! Check it out!', 
    likes: 5, 
    views: 20, 
    thumbnail: '', 
    comments: [], 
    timestamp: new Date(Date.now() - 3600000),
    hashtags: ['#portfolio', '#webdev']
  },
  { 
    id: 2,
    type: 'project', 
    user: 'User2', 
    avatar: '👩', 
    content: 'Working on a cool Vue dashboard project!', 
    impressions: 10, 
    thumbnail: '', 
    comments: [],
    timestamp: new Date(Date.now() - 7200000),
    hashtags: ['#vue', '#dashboard']
  },
  { 
    id: 3,
    type: 'story', 
    user: 'User3', 
    avatar: '🧑', 
    content: 'Quick coding session today!', 
    video: '', 
    views: 15, 
    comments: [],
    timestamp: new Date(Date.now() - 10800000),
    hashtags: ['#coding', '#story']
  },
  { 
    id: 4,
    type: 'video', 
    user: 'User4', 
    avatar: '👨‍💻', 
    content: 'Tutorial: Building a Vue app from scratch', 
    video: '', 
    likes: 8, 
    views: 30, 
    comments: [],
    timestamp: new Date(Date.now() - 14400000),
    hashtags: ['#tutorial', '#vue']
  }
]);

const newStoryContent = ref('');
const newStoryVideo = ref(null);
const searchQuery = ref('');

const addStory = () => {
  if (newStoryContent.value.trim()) {
    feed.value.unshift({
      id: feed.value.length + 1,
      type: 'story',
      user: 'You',
      avatar: '😊',
      content: newStoryContent.value,
      video: newStoryVideo.value ? URL.createObjectURL(newStoryVideo.value) : '',
      views: 0,
      comments: [],
      timestamp: new Date(),
      hashtags: []
    });
    newStoryContent.value = '';
    newStoryVideo.value = null;
    console.log('Story added!');
  }
};

const likeItem = (item) => {
  item.likes = (item.likes || 0) + 1;
};

const commentOnItem = (item, text) => {
  if (text.trim()) {
    item.comments.push({ user: 'You', text, timestamp: new Date() });
  }
};

const viewVideo = (item) => {
  item.views = (item.views || 0) + 1;
  console.log('Video viewed!');
};

const shareItem = (item) => {
  item.shares = (item.shares || 0) + 1;
  console.log('Item shared!');
};

const filteredFeed = computed(() => {
  if (!searchQuery.value.trim()) return feed.value;
  return feed.value.filter(item =>
    item.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
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
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">CodeSphere</h1>
      <p class="hero-subtitle">Connect like LinkedIn, share like Instagram, learn like YouTube—all for coders.</p>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Search posts, stories, or hashtags..." class="search-input" />
        <i class="fas fa-search search-icon"></i>
      </div>
    </div>

    <div class="story-form">
      <textarea v-model="newStoryContent" placeholder="Share your coding story..." class="story-input"></textarea>
      <div class="story-actions">
        <input type="file" accept="video/*" @change="e => newStoryVideo = e.target.files[0]" class="file-input" />
        <button @click="addStory" class="story-button">Post Story</button>
      </div>
    </div>

    <div class="feed">
      <h2 class="feed-title">Community Feed</h2>
      <transition-group name="feed" tag="div" class="feed-grid">
        <div v-for="item in filteredFeed" :key="item.id" class="feed-card" :class="item.type">
          <div class="card-header">
            <span class="user-avatar">{{ item.avatar }}</span>
            <div class="user-info">
              <span class="user-name">{{ item.user }}</span>
              <span class="timestamp">{{ formatTime(item.timestamp) }}</span>
            </div>
          </div>
          <div class="card-content">
            <p class="content-text">{{ item.content }}</p>
            <div class="hashtags">
              <span v-for="tag in item.hashtags" :key="tag" class="hashtag" @click="searchQuery = tag">#{{ tag }}</span>
            </div>
            <video v-if="item.video" :src="item.video" controls class="media-video"></video>
            <img v-if="item.thumbnail" :src="item.thumbnail" alt="Thumbnail" class="media-image" />
          </div>
          <div class="card-stats">
            <span v-if="item.likes">❤️ {{ item.likes }} Likes</span>
            <span v-if="item.views">👁️ {{ item.views }} Views</span>
            <span v-if="item.impressions">📊 {{ item.impressions }} Impressions</span>
            <span v-if="item.shares">🔄 {{ item.shares }} Shares</span>
          </div>
          <div class="card-actions">
            <button @click="likeItem(item)" class="action-button">
              <i class="fas fa-heart"></i> Like
            </button>
            <button v-if="item.type === 'video'" @click="viewVideo(item)" class="action-button">
              <i class="fas fa-play"></i> Play
            </button>
            <button @click="shareItem(item)" class="action-button">
              <i class="fas fa-share"></i> Share
            </button>
          </div>
          <div class="comments">
            <div v-for="(comment, cIndex) in item.comments" :key="cIndex" class="comment">
              <strong>{{ comment.user }}</strong>: {{ comment.text }}
              <span class="comment-timestamp">{{ formatTime(comment.timestamp) }}</span>
            </div>
            <div class="comment-input">
              <input type="text" placeholder="Add a comment..." @keyup.enter="commentOnItem(item, $event.target.value); $event.target.value = ''" />
              <i class="fas fa-comment"></i>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.home {
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

.search-bar {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
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

/* Story Form */
.story-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
  margin-bottom: 30px;
}

.story-input {
  padding: 12px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
}

.story-input:focus {
  outline: none;
  border-color: #60a5fa;
}

.story-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.file-input {
  color: #f9fafb;
}

.story-button {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #f9fafb;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.story-button:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
  transform: translateY(-2px);
}

/* Feed Section */
.feed-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f9fafb;
}

.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.feed-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feed-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.feed-card.story {
  border-left: 4px solid #f59e0b;
}

.feed-card.post {
  border-left: 4px solid #3b82f6;
}

.feed-card.project {
  border-left: 4px solid #22c55e;
}

.feed-card.video {
  border-left: 4px solid #ef4444;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
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

.user-name {
  font-weight: 600;
  color: #f9fafb;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
}

.card-content {
  margin-bottom: 15px;
}

.content-text {
  font-size: 16px;
  line-height: 1.5;
  color: #e5e7eb;
}

.hashtags {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.hashtag {
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.hashtag:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.media-video,
.media-image {
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

.comments {
  border-top: 1px solid #3b82f6;
  padding-top: 15px;
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
.feed-enter-active,
.feed-leave-active {
  transition: all 0.5s ease;
}

.feed-enter-from,
.feed-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Light Mode */
.light-mode .home {
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
.light-mode .story-input,
.light-mode .comment-input input {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .search-input:focus,
.light-mode .story-input:focus,
.light-mode .comment-input input:focus {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .story-form {
  background: rgba(243, 244, 246, 0.5);
}

.light-mode .story-button,
.light-mode .action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .story-button:hover,
.light-mode .action-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .feed-card {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .user-name {
  color: #1f2937;
}

.light-mode .content-text {
  color: #4b5563;
}

.light-mode .timestamp,
.light-mode .card-stats,
.light-mode .comment-timestamp {
  color: #64748b;
}

.light-mode .hashtag {
  color: #3b82f6;
}

.light-mode .hashtag:hover {
  color: #2563eb;
}

.light-mode .comment {
  background: rgba(59, 130, 246, 0.1);
}

.light-mode .comments {
  border-top: 1px solid #3b82f6;
}

@media (max-width: 768px) {
  .home {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .feed-grid {
    grid-template-columns: 1fr;
  }
}
</style>