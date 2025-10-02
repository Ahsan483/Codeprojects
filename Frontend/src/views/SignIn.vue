<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleSignIn = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('authToken', response.data.token);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  }
};
</script>

<template>
  <div class="signin-container">
    <h2>Sign In</h2>
    <form @submit.prevent="handleSignIn">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.signin-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  text-align: center;
}

input {
  display: block;
  width: 95%;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>