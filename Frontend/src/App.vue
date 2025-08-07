<script setup>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="app-container">
    <Sidebar/>
    <div  class="main-content">
      <Navbar/>
    </div>

  </div>
</template>

<style scoped>

.app-container{
  display: flex;
  
}

.main-content {
  flex:1;

}

</style>