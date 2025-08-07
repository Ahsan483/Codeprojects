<template>
    <aside class="sidebar">
        <div class="sidebar-logo">MENU</div>
        <ul class="sidebar-list">
            <li class="sidebar-item">
                <a href="#">Profile</a>
            </li>
            <li class="sidebar-item">
                <a href="#">Setting</a>
            </li>
            <li class="sidebar-item">
                <a href="#">Logout</a>
            </li>
        </ul>
    </aside>
</template>

<style scoped>
.sidebar-list li{
    padding: 10px 20px;
    list-style: none;;
}

.sidebar-logo{
    font-size: 40px;
    padding: 10px 20px;
}
.sidebar {
    width: 250px;
    background-color:rgb(0, 0, 0);
    height: 100vh;
    border: 2px solid whitesmoke;

}

.sidebar-item a {
  text-decoration: none;
  color: #b17e2a;
  position: relative;
  transition: transform 0.4s ease-in-out , filter 0.3s ease-in-out;
}

.sidebar-item a:hover {
  color: #ffffff;
  background: none;
  transform: translateY(-5px);
  filter: brightness(4.2);
}
</style>
