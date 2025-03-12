<template>
    <div class="home-page">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchAnimes"
          placeholder="Search anime..."
        />
        <button @click="searchAnimes">Search</button>
      </div>
  
      <div class="category-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.name }}
        </button>
      </div>
  
      <div class="loading" v-if="loading">Loading...</div>
      
      <div class="animes-grid" v-else>
        <anime-card v-for="anime in displayedAnimes" :key="anime.mal_id" :anime="anime" />
      </div>
  
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <span>Page {{ currentPage }}</span>
        <button @click="nextPage">Next</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import AnimeCard from '../components/AnimeCard.vue';
  import AnimeService from '../services/anime-service';
  import type { Anime } from '../types/anime';
  
  export default defineComponent({
    name: 'HomePage',
    components: {
      AnimeCard
    },
    data() {
      return {
        topAnimes: [] as Anime[],
        seasonalAnimes: [] as Anime[],
        searchResults: [] as Anime[],
        loading: true,
        searchQuery: '',
        currentPage: 1,
        activeTab: 'top',
        tabs: [
          { id: 'top', name: 'Top Anime' },
          { id: 'seasonal', name: 'This Season' },
          { id: 'search', name: 'Search Results' }
        ]
      };
    },
    computed: {
      displayedAnimes(): Anime[] {
        switch (this.activeTab) {
          case 'top':
            return this.topAnimes;
          case 'seasonal':
            return this.seasonalAnimes;
          case 'search':
            return this.searchResults;
          default:
            return this.topAnimes;
        }
      }
    },
    methods: {
      async fetchTopAnimes() {
        this.loading = true;
        this.topAnimes = await AnimeService.getTopAnimes(this.currentPage);
        this.loading = false;
      },
      async fetchSeasonalAnimes() {
        this.loading = true;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        
        // Determine current season
        const month = currentDate.getMonth();
        let season = 'winter';
        if (month >= 3 && month < 6) season = 'spring';
        else if (month >= 6 && month < 9) season = 'summer';
        else if (month >= 9 && month < 12) season = 'fall';
        
        this.seasonalAnimes = await AnimeService.getSeasonalAnimes(year, season);
        this.loading = false;
      },
      async searchAnimes() {
        if (this.searchQuery.trim() === '') return;
        
        this.loading = true;
        this.activeTab = 'search';
        this.searchResults = await AnimeService.searchAnimes(this.searchQuery, this.currentPage);
        this.loading = false;
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.refreshCurrentTab();
        }
      },
      nextPage() {
        this.currentPage++;
        this.refreshCurrentTab();
      },
      refreshCurrentTab() {
        switch (this.activeTab) {
          case 'top':
            this.fetchTopAnimes();
            break;
          case 'seasonal':
            this.fetchSeasonalAnimes();
            break;
          case 'search':
            this.searchAnimes();
            break;
        }
      }
    },
    async mounted() {
      await this.fetchTopAnimes();
      await this.fetchSeasonalAnimes();
    }
  });
  </script>
  
  <style scoped>
  .home-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .search-box {
    margin-bottom: 20px;
    display: flex;
  }
  
  .search-box input {
    flex: 1;
    padding: 8px;
    border: 1px solid #444;
    background: #222;
    color: #eee;
  }
  
  .search-box button {
    padding: 8px 15px;
    background: #444;
    border: none;
    color: #eee;
    cursor: pointer;
  }
  
  .category-tabs {
    margin-bottom: 20px;
  }
  
  .category-tabs button {
    padding: 8px 15px;
    margin-right: 10px;
    background: #333;
    border: 1px solid #444;
    color: #eee;
    cursor: pointer;
  }
  
  .category-tabs button.active {
    background: #555;
  }
  
  .animes-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    color: #eee;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: center;
  }
  
  .pagination button {
    padding: 5px 10px;
    margin: 0 10px;
    background: #333;
    border: 1px solid #444;
    color: #eee;
    cursor: pointer;
  }
  
  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  