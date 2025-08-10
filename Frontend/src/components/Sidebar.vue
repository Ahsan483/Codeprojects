<template>
  <aside class="sidebar">
    <div class="sidebar-logo">MENU</div>
    <ul class="sidebar-list">
      <li class="sidebar-item"><a href="#">Projects</a></li>
      <li class="sidebar-item"><a href="#">Orders</a></li>
      <li class="sidebar-item"><a href="#">Posts</a></li>
      <li class="sidebar-item"><a href="#">Courses</a></li>
      <li class="sidebar-item"><a href="#">Requests</a></li>
      <li class="sidebar-item"><a href="#">Settings</a></li>
      <li class="sidebar-item"><a href="#">Logout</a></li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  width: 250px;
  background: linear-gradient(180deg, #1a2238 0%, #0a3d62 100%);
  border-right: 1px solid #00c4b4;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
}

.sidebar-logo {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  padding: 20px;
  color: #f59e0b;
  transition: color 0.3s ease;
}

.sidebar-logo:hover {
  color: #fb923c;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  padding: 15px 20px;
}

.sidebar-item a {
  color: #f59e0b;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  display: block;
  transition: all 0.3s ease;
}

.sidebar-item a:hover {
  color: #fb923c;
  background: rgba(0, 196, 180, 0.1);
  padding-left: 10px;
}

/* Light mode styles */
.light-mode .sidebar {
  background: linear-gradient(180deg, #f8fafc 0%, #e0f7fa 100%);
  border-right: 1px solid #4b9cd3;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
}

.light-mode .sidebar-logo,
.light-mode .sidebar-item a {
  color: #b45309;
}

.light-mode .sidebar-item a:hover {
  color: #fb923c;
  background: rgba(75, 156, 211, 0.1);
}
</style>