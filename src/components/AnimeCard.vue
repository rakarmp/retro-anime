<template>
    <div class="anime-card" @click="navigateToDetail">
      <div class="anime-card-image">
        <img :src="anime.images.jpg.image_url" :alt="anime.title" />
      </div>
      <div class="anime-card-content">
        <h3>{{ anime.title }}</h3>
        <div class="anime-score">
          <span>★ {{ anime.score }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  import type { Anime } from '../types/anime';
  
  export default defineComponent({
    name: 'AnimeCard',
    props: {
      anime: {
        type: Object as PropType<Anime>,
        required: true
      }
    },
    methods: {
      navigateToDetail() {
        this.$router.push(`/anime/${this.anime.mal_id}`);
      }
    }
  });
  </script>
  
  <style scoped>
  .anime-card {
    width: 200px;
    margin: 15px;
    background-color: #222;
    border: 1px solid #444;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .anime-card:hover {
    transform: translateY(-5px);
  }
  
  .anime-card-image img {
    width: 100%;
    height: 280px;
    object-fit: cover;
  }
  
  .anime-card-content {
    padding: 10px;
  }
  
  .anime-card-content h3 {
    margin: 0;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #eee;
  }
  
  .anime-score {
    margin-top: 5px;
    color: #ffcc00;
  }
  </style>