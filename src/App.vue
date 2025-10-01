<template>
  <div>
    <nav>
      <router-link to="/">Inicio</router-link>
      <router-link to="/cards">Cards</router-link>
      <router-link to="/sobre">Sobre</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
</script>

<style scoped>
nav {
  display: flex;
  gap: 16px;
  background-color: #1976d2;
  padding: 12px;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
