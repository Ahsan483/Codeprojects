<template>
  <nav class="navbar">
    <div class="navbar-con">
      <div class="navbar-logo">Code projects</div>
      <div class="navbar-list">
        <a href="#">Home1</a>
        <a href="#">Home2</a>
        <a href="#">Home3</a>
        <a href="#">Home4</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  border: 2px solid whitesmoke;
  border-radius: 10px;
  background: linear-gradient(90deg , #07a252 , #ff8800 , #000000);
}

.navbar-con {
  justify-content: space-between;
  width: 100%;
  display: flex;
}

.navbar-logo {
  font-size: large;
  color: #b17e2a;
  padding: 20px 10px;
  font-weight: bolder;
  transition: transform 0.4s ease-in-out , filter 0.3s ease-in-out;
}

.navbar-logo:hover {
    transform: translateY(-5px);
    filter: brightness(4.2);
}

.navbar-list {
  display: flex;
  gap: 50px;
  font-weight: 600;
  margin-right: 40px;
  align-items: center;
}

.navbar-list a {
  color: #b17e2a;
  position: relative;
  transition: transform 0.4s ease-in-out , filter 0.3s ease-in-out;
}

.navbar-list a:hover {
  color: #ffffff;
  background: none;
  transform: translateY(-5px);
  filter: brightness(4.2);
}

.navbar-list a::after {
  
}

.navbar-list a:hover::after {
  
}
</style>