<template>
<aside class="sidebar">

    <div class="sidebar-logo">
        MENU
    </div>

    <ul class="sidebar-list">
        <li class="sidebar-item"><a>Profile</a></li>
        <li class="sidebar-item"><a>Setting</a></li>
        <li class="sidebar-item"><a>Logout</a></li>
    </ul>


</aside>

</template>

<style scoped>
.sidebar{
    height: 100vh;
    position: fixed;;
    border: 2px solid whitesmoke;
    background-color: rgb(0, 0, 0);
    width: 250px;
}

.sidebar-logo{
    font-size: 30px;
    text-align: center;
    padding: 10px;
}

.sidebar-list li{
    padding: 10px 20px ;
    list-style: none;
}
.sidebar-item a {
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
