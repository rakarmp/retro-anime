<template>
  <div id="app">
    <header>
      <div class="header-container">
        <div class="logo" @click="$router.push('/')">YourAnimeList</div>
        <nav>
          <router-link to="/">Home</router-link>
        </nav>
      </div>
    </header>
    
    <main>
      <router-view />
    </main>
    
    <footer>
      <div class="footer-content">
        <p>YourAnimeList &copy; {{ currentYear }} - Powered by <a href="https://jikan.moe/" target="_blank">Jikan API</a></p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  computed: {
    currentYear(): number {
      return new Date().getFullYear();
    }
  }
});
</script>

<style>
/* Global Styles with Retro Theme */
body {
  margin: 0;
  font-family: 'Courier New', monospace;
  background-color: #111;
  color: #eee;
}

* {
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #222;
  padding: 15px 0;
  border-bottom: 1px solid #444;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ffcc00;
  cursor: pointer;
}

nav a {
  color: #eee;
  text-decoration: none;
  margin-left: 20px;
}

main {
  flex: 1;
}

footer {
  background-color: #222;
  padding: 15px 0;
  border-top: 1px solid #444;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

a {
  color: #ffcc00;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  font-family: 'Courier New', monospace;
}
</style>