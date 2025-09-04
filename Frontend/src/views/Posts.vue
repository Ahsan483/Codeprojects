<!-- src/views/Posts.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';
//import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Adjust to your .NET API URL

const users = ref([
  { id: 1, name: 'User1', avatar: '👨', followers: 100, following: false },
  { id: 2, name: 'User2', avatar: '👩', followers: 150, following: true },
  { id: 3, name: 'User3', avatar: '🧑', followers: 80, following: false },
  // Add more users as needed
]);

const posts = ref([]);

const newPostContent = ref('');
const newPostImage = ref(null);
const newPostVideo = ref(null);
const newPostHashtags = ref('');
const searchQuery = ref('');
const sortOption = ref('newest');
const currentUser = { id: 0, name: 'You', avatar: '😊' }; // Simulated current user

const fetchData = async () => {
  try {
    const [postsRes, usersRes] = await Promise.all([
      axios.get(`${API_BASE}/posts`),
      axios.get(`${API_BASE}/users`)
    ]);
    posts.value = postsRes.data;
    users.value = usersRes.data;
  } catch (error) {
    console.error('API fetch error, using sample data:', error);
    // Fallback sample data
    posts.value = [
      {
        id: 1,
        userId: 1,
        content: 'Just finished my first Vue project! Check it out!',
        image: '',
        video: '',
        likes: 5,
        comments: [{ userId: 2, text: 'Nice work!', timestamp: new Date(Date.now() - 3600000) }],
        shares: 2,
        hashtags: ['#coding', '#vue'],
        saved: false,
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: 2,
        userId: 2,
        content: 'Loving .NET for backend! Built an API today.',
        image: '',
        video: '',
        likes: 10,
        comments: [],
        shares: 3,
        hashtags: ['#dotnet', '#api'],
        saved: false,
        timestamp: new Date(Date.now() - 10800000)
      },
      {
        id: 3,
        userId: 3,
        content: 'Sharing my coding setup. What\'s yours?',
        image: '',
        video: '',
        likes: 8,
        comments: [{ userId: 1, text: 'Cool setup!', timestamp: new Date(Date.now() - 1800000) }],
        shares: 1,
        hashtags: ['#codinglife'],
        saved: false,
        timestamp: new Date(Date.now() - 14400000)
      }
    ];
  }
};

const createPost = async () => {
  if (newPostContent.value.trim()) {
    const newPost = {
      userId: currentUser.id,
      content: newPostContent.value,
      image: newPostImage.value ? URL.createObjectURL(newPostImage.value) : '',
      video: newPostVideo.value ? URL.createObjectURL(newPostVideo.value) : '',
      likes: 0,
      comments: [],
      shares: 0,
      hashtags: newPostHashtags.value.split(',').map(tag => tag.trim()),
      saved: false,
      timestamp: new Date()
    };
    try {
      const res = await axios.post(`${API_BASE}/posts`, newPost);
      posts.value.unshift(res.data);
    } catch (error) {
      console.error('API error, adding locally:', error);
      newPost.id = posts.value.length + 1;
      posts.value.unshift(newPost);
    }
    newPostContent.value = '';
    newPostImage.value = null;
    newPostVideo.value = null;
    newPostHashtags.value = '';
  }
};

const likePost = async (post) => {
  post.likes++;
  try {
    await axios.put(`${API_BASE}/posts/${post.id}/like`);
  } catch (error) {
    console.error('API error:', error);
  }
};

const sharePost = async (post) => {
  post.shares++;
  try {
    await axios.put(`${API_BASE}/posts/${post.id}/share`);
  } catch (error) {
    console.error('API error:', error);
  }
};

const addComment = async (post, commentText) => {
  if (commentText.trim()) {
    const newComment = { userId: currentUser.id, text: commentText, timestamp: new Date() };
    post.comments.push(newComment);
    try {
      await axios.post(`${API_BASE}/posts/${post.id}/comments`, newComment);
    } catch (error) {
      console.error('API error:', error);
    }
  }
};

const savePost = async (post) => {
  post.saved = !post.saved;
  try {
    await axios.put(`${API_BASE}/posts/${post.id}/save`, { saved: post.saved });
  } catch (error) {
    console.error('API error:', error);
  }
};

const followUser = async (user) => {
  user.following = !user.following;
  user.followers += user.following ? 1 : -1;
  try {
    await axios.put(`${API_BASE}/users/${user.id}/follow`, { following: user.following });
  } catch (error) {
    console.error('API error:', error);
  }
};

const editPost = async (post, newContent) => {
  if (newContent && newContent.trim()) {
    post.content = newContent;
    try {
      await axios.put(`${API_BASE}/posts/${post.id}`, { content: newContent });
    } catch (error) {
      console.error('API error:', error);
    }
  }
};

const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_BASE}/posts/${postId}`);
  } catch (error) {
    console.error('API error:', error);
  }
  posts.value = posts.value.filter(p => p.id !== postId);
};

const getUserById = (userId) => users.value.find(u => u.id === userId) || currentUser;

const filteredPosts = computed(() => {
  let result = posts.value.filter(post => {
    const user = getUserById(post.userId);
    return (
      post.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortOption.value === 'likes') {
    result.sort((a, b) => b.likes - a.likes);
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

const createReel = () => {
  console.log('Reel created!'); // Placeholder; extend with API if needed
};

const createStory = () => {
  console.log('Story created!'); // Placeholder; extend with API if needed
};

onMounted(fetchData);
</script>

<template>
  <div class="posts">
    <div class="hero-section">
      <div class="particles"></div>
      <h1 class="hero-title">Social Coding Feed</h1>
      <p class="hero-subtitle">Share your coding journey with posts, reels, and stories. Connect with developers worldwide!</p>
      <div class="search-sort">
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="Search posts, hashtags, or users..." class="search-input" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <select v-model="sortOption" class="sort-select">
          <option value="newest">Newest</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>
    </div>

    <div class="post-form">
      <textarea v-model="newPostContent" placeholder="Share your coding thoughts..." class="form-textarea"></textarea>
      <input v-model="newPostHashtags" placeholder="Hashtags (e.g., coding, vue)" class="form-input" />
      <div class="file-inputs">
        <input type="file" accept="image/*" @change="e => newPostImage = e.target.files[0]" class="form-file" />
        <input type="file" accept="video/*" @change="e => newPostVideo = e.target.files[0]" class="form-file" />
      </div>
      <div class="form-actions">
        <button @click="createPost" class="action-button pulse">
          <i class="fas fa-paper-plane"></i> Post
        </button>
        <button @click="createStory" class="action-button pulse">
          <i class="fas fa-camera"></i> Create Story
        </button>
        <button @click="createReel" class="action-button pulse">
          <i class="fas fa-video"></i> Create Reel
        </button>
      </div>
    </div>

    <transition-group name="post-list" tag="div" class="post-grid">
      <div v-for="post in filteredPosts" :key="post.id" class="post-card">
        <div class="card-header">
          <span class="user-avatar">{{ getUserById(post.userId).avatar }}</span>
          <div class="user-info">
            <span class="user-name">{{ getUserById(post.userId).name }}</span>
            <span class="timestamp">{{ formatTime(post.timestamp) }}</span>
          </div>
          <button v-if="post.userId === currentUser.id" class="delete-btn" @click="deletePost(post.id)" title="Delete Post">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="card-content">
          <p class="content-text">{{ post.content }}</p>
          <div class="hashtags">
            <span v-for="tag in post.hashtags" :key="tag" class="hashtag" @click="searchQuery = tag">#{{ tag }}</span>
          </div>
          <img v-if="post.image" :src="post.image" alt="Post Image" class="post-media" />
          <video v-if="post.video" :src="post.video" controls class="post-media"></video>
        </div>
        <div class="card-stats">
          <span><i class="fas fa-heart"></i> {{ post.likes }} Likes</span>
          <span><i class="fas fa-share"></i> {{ post.shares }} Shares</span>
          <span><i class="fas fa-users"></i> {{ getUserById(post.userId).followers }} Followers</span>
        </div>
        <div class="card-actions">
          <button @click="likePost(post)" class="action-button">
            <i class="fas fa-heart"></i> Like
          </button>
          <button @click="sharePost(post)" class="action-button">
            <i class="fas fa-share"></i> Share
          </button>
          <button @click="savePost(post)" class="action-button">
            <i class="fas fa-bookmark"></i> {{ post.saved ? 'Unsave' : 'Save' }}
          </button>
          <button v-if="post.userId !== currentUser.id" @click="followUser(getUserById(post.userId))" class="action-button">
            <i class="fas fa-user-plus"></i> {{ getUserById(post.userId).following ? 'Unfollow' : 'Follow' }}
          </button>
          <button v-if="post.userId === currentUser.id" @click="editPost(post, prompt('New content:', post.content))" class="action-button">
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
        <div class="comments">
          <h4>Comments</h4>
          <div v-for="(comment, index) in post.comments" :key="index" class="comment">
            <strong>{{ getUserById(comment.userId).name }}:</strong> {{ comment.text }}
            <span class="comment-timestamp">{{ formatTime(comment.timestamp) }}</span>
          </div>
          <div class="comment-input">
            <input type="text" placeholder="Add a comment..." @keyup.enter="addComment(post, $event.target.value); $event.target.value = ''" />
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

/* Enhanced theme for attractiveness */
.posts {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85));
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  color: #f9fafb;
  display: grid;
  gap: 30px;
  position: relative;
  overflow: hidden;
}

.hero-section {
  text-align: center;
  padding: 50px 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8, #2563eb);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: particles 10s linear infinite;
}

@keyframes particles {
  0% { background-position: 0 0; }
  100% { background-position: 100px 100px; }
}

.hero-title {
  font-size: 52px;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  background: linear-gradient(45deg, #f9fafb, #60a5fa, #93c5fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 0 0 10px #60a5fa; }
  to { text-shadow: 0 0 20px #93c5fd; }
}

.hero-subtitle {
  font-size: 20px;
  color: #e5e7eb;
  margin-bottom: 25px;
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

.sort-select {
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.9);
  color: #f9fafb;
  font-size: 14px;
  cursor: pointer;
}

.post-form {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
  display: grid;
  gap: 15px;
}

.form-textarea,
.form-input {
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
.form-textarea:focus {
  outline: none;
  border-color: #60a5fa;
}

.file-inputs {
  display: flex;
  gap: 10px;
}

.form-file {
  color: #f9fafb;
}

.form-actions {
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
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.post-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.post-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
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

.user-name {
  font-weight: 600;
  color: #f9fafb;
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
  transform: scale(1.1);
}

.post-media {
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
  width: 100%;
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

.post-list-enter-active,
.post-list-leave-active {
  transition: all 0.5s ease;
}

.post-list-enter-from,
.post-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.light-mode .posts {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.95), rgba(191, 219, 254, 0.85));
  color: #1f2937;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.light-mode .hero-section {
  background: linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb);
}

.light-mode .hero-title {
  background: linear-gradient(45deg, #1f2937, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.light-mode .hero-subtitle,
.light-mode .content-text {
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

.light-mode .sort-select {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
}

.light-mode .post-form,
.light-mode .post-card {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .action-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #1f2937;
}

.light-mode .delete-btn:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.light-mode .user-name {
  color: #1f2937;
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
  .posts {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .post-grid {
    grid-template-columns: 1fr;
  }
}
</style>