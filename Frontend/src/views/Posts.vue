<script setup>
import { ref, computed } from 'vue';

const posts = ref([
  {
    id: 1,
    user: 'User1',
    avatar: '👨',
    content: 'Just finished my first Vue project! Check it out!',
    image: '',
    video: '',
    likes: 5,
    comments: [{ user: 'User2', text: 'Nice work!', timestamp: new Date(Date.now() - 3600000) }],
    shares: 2,
    hashtags: ['#coding', '#vue'],
    saved: false,
    followers: 100,
    following: false,
    timestamp: new Date(Date.now() - 7200000)
  }
]);

const newPostContent = ref('');
const newPostImage = ref(null);
const newPostVideo = ref(null);
const newPostHashtags = ref('');
const searchQuery = ref('');
const sortOption = ref('newest');

const createPost = () => {
  if (newPostContent.value.trim()) {
    posts.value.unshift({
      id: posts.value.length + 1,
      user: 'You',
      avatar: '😊',
      content: newPostContent.value,
      image: newPostImage.value ? URL.createObjectURL(newPostImage.value) : '',
      video: newPostVideo.value ? URL.createObjectURL(newPostVideo.value) : '',
      likes: 0,
      comments: [],
      shares: 0,
      hashtags: newPostHashtags.value.split(',').map(tag => tag.trim()),
      saved: false,
      followers: 0,
      following: false,
      timestamp: new Date()
    });
    newPostContent.value = '';
    newPostImage.value = null;
    newPostVideo.value = null;
    newPostHashtags.value = '';
    console.log('Post created!');
  }
};

const likePost = (post) => {
  post.likes++;
};

const sharePost = (post) => {
  post.shares++;
  console.log('Post shared!');
};

const addComment = (post, commentText) => {
  if (commentText.trim()) {
    post.comments.push({ user: 'You', text: commentText, timestamp: new Date() });
  }
};

const savePost = (post) => {
  post.saved = !post.saved;
  console.log(`Post ${post.saved ? 'saved' : 'unsaved'}!`);
};

const followUser = (post) => {
  post.following = !post.following;
  post.followers += post.following ? 1 : -1;
  console.log(`${post.following ? 'Followed' : 'Unfollowed'} ${post.user}!`);
};

const createReel = () => {
  console.log('Reel created!');
};

const createStory = () => {
  console.log('Story created!');
};

const editPost = (post, newContent) => {
  if (newContent && newContent.trim()) {
    post.content = newContent;
    console.log('Post edited!');
  }
};

const deletePost = (postId) => {
  posts.value = posts.value.filter(p => p.id !== postId);
  console.log('Post deleted!');
};

const filteredPosts = computed(() => {
  let result = posts.value.filter(post =>
    post.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
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
</script>

<template>
  <div class="posts">
    <div class="hero-section">
      <h1 class="hero-title">Social Coding Feed</h1>
      <p class="hero-subtitle">Share your coding journey with posts, reels, and stories.</p>
      <div class="search-sort">
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="Search posts or hashtags..." class="search-input" />
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
        <button @click="createPost" class="action-button">
          <i class="fas fa-paper-plane"></i> Post
        </button>
        <button @click="createStory" class="action-button">
          <i class="fas fa-camera"></i> Create Story
        </button>
        <button @click="createReel" class="action-button">
          <i class="fas fa-video"></i> Create Reel
        </button>
      </div>
    </div>

    <transition-group name="post-list" tag="div" class="post-grid">
      <div v-for="post in filteredPosts" :key="post.id" class="post-card">
        <div class="card-header">
          <span class="user-avatar">{{ post.avatar }}</span>
          <div class="user-info">
            <span class="user-name">{{ post.user }}</span>
            <span class="timestamp">{{ formatTime(post.timestamp) }}</span>
          </div>
          <button class="delete-btn" @click="deletePost(post.id)" title="Delete Post">
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
          <span><i class="fas fa-users"></i> {{ post.followers }} Followers</span>
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
          <button @click="followUser(post)" class="action-button">
            <i class="fas fa-user-plus"></i> {{ post.following ? 'Unfollow' : 'Follow' }}
          </button>
          <button @click="editPost(post, prompt('New content:', post.content))" class="action-button">
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
        <div class="comments">
          <h4>Comments</h4>
          <div v-for="(comment, index) in post.comments" :key="index" class="comment">
            <strong>{{ comment.user }}:</strong> {{ comment.text }}
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

.posts {
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
  transform: translateY(-2px);
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
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