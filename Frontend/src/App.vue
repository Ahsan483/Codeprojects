<script setup>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
</script>


<template>
  <div class="app-container">
    <Sidebar/>
    <div class="main-container">
      <Navbar/>
    </div>
  </div>
</template>

<style scoped>
.app-container{
  display: flex;;
}
.main-container{
  flex:1;
  padding-left: 250px;
}
</style>
