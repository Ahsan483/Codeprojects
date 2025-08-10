<script setup>
import { ref, computed } from 'vue';

const courses = ref([
  {
    id: 1,
    title: 'Vue Basics',
    description: 'Learn the fundamentals of Vue.js for building modern web applications.',
    videos: [{ title: 'Intro to Vue', video: '', views: 100, timestamp: new Date(Date.now() - 3600000) }],
    enrolled: false,
    progress: 0,
    quizzes: [{ question: 'What is Vue?', options: ['Framework', 'Library', 'Language'], answer: 'Framework', userAnswer: null }],
    playlists: [],
    category: 'Frontend',
    tags: ['vue', 'beginner'],
    timestamp: new Date(Date.now() - 7200000)
  }
]);

const newCourseTitle = ref('');
const newCourseDesc = ref('');
const newCourseCategory = ref('Frontend');
const newCourseTags = ref('');
const newVideoTitle = ref('');
const newVideo = ref(null);
const newQuizQuestion = ref('');
const newQuizOptions = ref('');
const newQuizAnswer = ref('');
const newPlaylistName = ref('');
const searchQuery = ref('');
const sortOption = ref('newest');

const createCourse = () => {
  if (newCourseTitle.value.trim() && newCourseDesc.value.trim()) {
    courses.value.unshift({
      id: courses.value.length + 1,
      title: newCourseTitle.value,
      description: newCourseDesc.value,
      videos: [],
      enrolled: false,
      progress: 0,
      quizzes: [],
      playlists: [],
      category: newCourseCategory.value,
      tags: newCourseTags.value.split(',').map(tag => tag.trim()),
      timestamp: new Date()
    });
    newCourseTitle.value = '';
    newCourseDesc.value = '';
    newCourseCategory.value = 'Frontend';
    newCourseTags.value = '';
    console.log('Course created!');
  }
};

const enrollCourse = (course) => {
  course.enrolled = !course.enrolled;
  console.log(`${course.enrolled ? 'Enrolled' : 'Unenrolled'} in ${course.title}!`);
};

const addVideo = (course, title, video) => {
  if (title.trim() && video) {
    course.videos.push({ title, video, views: 0, timestamp: new Date() });
    console.log('Video added!');
    newVideoTitle.value = '';
    newVideo.value = null;
  }
};

const watchVideo = (video, course) => {
  video.views++;
  course.progress = Math.min(course.progress + (100 / course.videos.length), 100);
  console.log('Video watched!');
};

const addQuiz = (course, question, options, answer) => {
  if (question.trim() && options.trim() && answer.trim()) {
    course.quizzes.push({
      question,
      options: options.split(',').map(opt => opt.trim()),
      answer,
      userAnswer: null
    });
    console.log('Quiz added!');
    newQuizQuestion.value = '';
    newQuizOptions.value = '';
    newQuizAnswer.value = '';
  }
};

const takeQuiz = (course, quizIndex, userAnswer) => {
  const quiz = course.quizzes[quizIndex];
  quiz.userAnswer = userAnswer;
  if (userAnswer === quiz.answer) {
    course.progress = Math.min(course.progress + (100 / course.quizzes.length), 100);
    console.log('Correct answer! Progress updated.');
  } else {
    console.log('Incorrect answer!');
  }
};

const createPlaylist = (course, name) => {
  if (name.trim()) {
    course.playlists.push({ name, videos: [] });
    console.log('Playlist created!');
    newPlaylistName.value = '';
  }
};

const addVideoToPlaylist = (course, playlistIndex, video) => {
  course.playlists[playlistIndex].videos.push(video);
  console.log('Video added to playlist!');
};

const recommendCourses = () => {
  console.log('Recommended courses: Advanced Vue, React Basics, JavaScript Mastery');
};

const filteredCourses = computed(() => {
  let result = courses.value.filter(course =>
    course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortOption.value === 'progress') {
    result.sort((a, b) => b.progress - a.progress);
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
  <div class="courses">
    <div class="hero-section">
      <h1 class="hero-title">Learning Hub</h1>
      <p class="hero-subtitle">Explore coding courses and build your skills like on YouTube.</p>
      <div class="search-sort">
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="Search courses by title, description, or tags..." class="search-input" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <select v-model="sortOption" class="sort-select">
          <option value="newest">Newest</option>
          <option value="progress">Progress</option>
        </select>
      </div>
    </div>

    <div class="course-form">
      <input v-model="newCourseTitle" placeholder="Course Title (e.g., Vue Basics)" class="form-input" />
      <textarea v-model="newCourseDesc" placeholder="Course Description" class="form-textarea"></textarea>
      <select v-model="newCourseCategory" class="form-select">
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Full Stack">Full Stack</option>
      </select>
      <input v-model="newCourseTags" placeholder="Tags (e.g., vue, beginner)" class="form-input" />
      <button @click="createCourse" class="form-button">
        <i class="fas fa-plus"></i> Create Course
      </button>
    </div>

    <transition-group name="course-list" tag="div" class="course-grid">
      <div v-for="course in filteredCourses" :key="course.id" class="course-card">
        <div class="card-header">
          <span class="category-badge">{{ course.category }}</span>
          <span class="timestamp">{{ formatTime(course.timestamp) }}</span>
        </div>
        <div class="card-content">
          <h3>{{ course.title }}</h3>
          <p class="description">{{ course.description }}</p>
          <p><strong>Progress:</strong> {{ course.progress.toFixed(0) }}%</p>
          <div class="tags">
            <span v-for="tag in course.tags" :key="tag" class="tag" @click="searchQuery = tag">#{{ tag }}</span>
          </div>
        </div>
        <div class="card-actions">
          <button @click="enrollCourse(course)" class="action-button">
            <i class="fas fa-user-plus"></i> {{ course.enrolled ? 'Unenroll' : 'Enroll' }}
          </button>
          <button @click="recommendCourses" class="action-button">
            <i class="fas fa-lightbulb"></i> Recommend
          </button>
        </div>
        <div class="videos">
          <h4>Videos</h4>
          <div v-if="course.videos.length === 0" class="no-content">No videos yet</div>
          <div v-for="(video, index) in course.videos" :key="index" class="video-item">
            <p>{{ video.title }} (Views: {{ video.views }}) <span class="timestamp">{{ formatTime(video.timestamp) }}</span></p>
            <video :src="video.video" controls class="video-media"></video>
            <button @click="watchVideo(video, course)" class="action-button">
              <i class="fas fa-play"></i> Watch
            </button>
            <div v-for="(playlist, pIndex) in course.playlists" :key="pIndex" class="playlist-add">
              <button @click="addVideoToPlaylist(course, pIndex, video)" class="action-button">
                <i class="fas fa-list"></i> Add to {{ playlist.name }}
              </button>
            </div>
          </div>
          <div class="video-form">
            <input v-model="newVideoTitle" placeholder="Video Title" class="form-input" />
            <input type="file" accept="video/*" @change="e => newVideo = e.target.files[0]" class="form-file" />
            <button @click="addVideo(course, newVideoTitle, newVideo ? URL.createObjectURL(newVideo) : '')" class="action-button">
              <i class="fas fa-video"></i> Add Video
            </button>
          </div>
        </div>
        <div class="quizzes">
          <h4>Quizzes</h4>
          <div v-if="course.quizzes.length === 0" class="no-content">No quizzes yet</div>
          <div v-for="(quiz, qIndex) in course.quizzes" :key="qIndex" class="quiz-item">
            <p>{{ quiz.question }}</p>
            <div v-for="(option, oIndex) in quiz.options" :key="oIndex" class="quiz-option">
              <input type="radio" :name="'quiz-' + course.id + '-' + qIndex" :value="option" @change="takeQuiz(course, qIndex, option)" :disabled="quiz.userAnswer" />
              <label>{{ option }}</label>
            </div>
            <p v-if="quiz.userAnswer" :class="quiz.userAnswer === quiz.answer ? 'correct' : 'incorrect'">
              Your answer: {{ quiz.userAnswer }} ({{ quiz.userAnswer === quiz.answer ? 'Correct' : 'Incorrect' }})
            </p>
          </div>
          <div class="quiz-form">
            <input v-model="newQuizQuestion" placeholder="Quiz Question" class="form-input" />
            <input v-model="newQuizOptions" placeholder="Options (comma-separated)" class="form-input" />
            <input v-model="newQuizAnswer" placeholder="Correct Answer" class="form-input" />
            <button @click="addQuiz(course, newQuizQuestion, newQuizOptions, newQuizAnswer)" class="action-button">
              <i class="fas fa-question"></i> Add Quiz
            </button>
          </div>
        </div>
        <div class="playlists">
          <h4>Playlists</h4>
          <div v-if="course.playlists.length === 0" class="no-content">No playlists yet</div>
          <div v-for="(playlist, pIndex) in course.playlists" :key="pIndex" class="playlist-item">
            <p>{{ playlist.name }}</p>
            <div v-for="(video, vIndex) in playlist.videos" :key="vIndex" class="playlist-video">
              {{ video.title }}
            </div>
          </div>
          <div class="playlist-form">
            <input v-model="newPlaylistName" placeholder="Playlist Name" class="form-input" />
            <button @click="createPlaylist(course, newPlaylistName)" class="action-button">
              <i class="fas fa-list"></i> Create Playlist
            </button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.courses {
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
.form-select {
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.9);
  color: #f9fafb;
  font-size: 14px;
  cursor: pointer;
}

.course-form {
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

.form-file {
  color: #f9fafb;
}

.form-button,
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

.form-button:hover,
.action-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.course-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-badge {
  background: #22c55e;
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
}

.card-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px;
}

.description {
  font-size: 14px;
  color: #e5e7eb;
  margin-bottom: 10px;
}

.card-content p {
  font-size: 14px;
  margin: 5px 0;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tag {
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tag:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.videos,
.quizzes,
.playlists {
  border-top: 1px solid #3b82f6;
  padding-top: 15px;
  margin-top: 15px;
}

.video-item,
.quiz-item,
.playlist-item {
  background: rgba(59, 130, 246, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.video-media {
  max-width: 100%;
  border-radius: 8px;
  margin: 10px 0;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
}

.quiz-option input {
  cursor: pointer;
}

.correct {
  color: #22c55e;
}

.incorrect {
  color: #ef4444;
}

.no-content {
  color: #94a3b8;
  font-size: 14px;
}

.video-form,
.quiz-form,
.playlist-form {
  display: grid;
  gap: 10px;
  margin-top: 15px;
}

.playlist-add {
  margin-top: 10px;
}

.course-list-enter-active,
.course-list-leave-active {
  transition: all 0.5s ease;
}

.course-list-enter-from,
.course-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.light-mode .courses {
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
.light-mode .description,
.light-mode .card-content p {
  color: #4b5563;
}

.light-mode .search-input,
.light-mode .form-input,
.light-mode .form-textarea {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .search-input:focus,
.light-mode .form-input:focus,
.light-mode .form-textarea:focus {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .sort-select,
.light-mode .form-select {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
}

.light-mode .course-form,
.light-mode .course-card,
.light-mode .video-item,
.light-mode .quiz-item,
.light-mode .playlist-item {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .form-button,
.light-mode .action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .form-button:hover,
.light-mode .action-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .category-badge {
  background: #22c55e;
  color: #fff;
}

.light-mode .timestamp,
.light-mode .no-content {
  color: #64748b;
}

.light-mode .tag {
  color: #3b82f6;
}

.light-mode .tag:hover {
  color: #2563eb;
}

.light-mode .videos,
.light-mode .quizzes,
.light-mode .playlists {
  border-top: 1px solid #3b82f6;
}

@media (max-width: 768px) {
  .courses {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>