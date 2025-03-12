<template>
  <div class="anime-detail">
    <div class="loading" v-if="loading">Loading...</div>
    
    <div v-else-if="anime" class="anime-content">
      <div class="anime-header">
        <div class="anime-poster">
          <img :src="anime.images.jpg.large_image_url" :alt="anime.title" />
        </div>
        
        <div class="anime-info">
          <h1>{{ anime.title }}</h1>
          <h2 v-if="anime.title_english && anime.title_english !== anime.title">
            {{ anime.title_english }}
          </h2>
          <h3 v-if="anime.title_japanese">{{ anime.title_japanese }}</h3>
          
          <div class="anime-stats">
            <p><strong>Score:</strong> {{ anime.score }} (by {{ anime.scored_by }} users)</p>
            <p><strong>Rank:</strong> #{{ anime.rank }}</p>
            <p><strong>Popularity:</strong> #{{ anime.popularity }}</p>
            <p><strong>Status:</strong> {{ anime.status }}</p>
            <p><strong>Aired:</strong> {{ formatDate(anime.aired.from) }} to {{ formatDate(anime.aired.to) }}</p>
          </div>
          
          <div class="anime-genres">
            <span v-for="genre in anime.genres" :key="genre.mal_id" class="genre-tag">
              {{ genre.name }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="anime-synopsis">
        <h3>Synopsis</h3>
        <p>{{ anime.synopsis }}</p>
      </div>
      
      <div class="anime-trailer" v-if="anime.trailer && anime.trailer.youtube_id">
        <h3>Trailer</h3>
        <div class="trailer-embed">
          <iframe
            width="100%"
            height="400"
            :src="'https://www.youtube.com/embed/' + anime.trailer.youtube_id"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      
      <div class="anime-comments">
        <h3>Comments</h3>
        <div id="disqus_thread"></div>
      </div>
    </div>
    
    <div v-else class="error-message">
      Anime not found or an error occurred.
    </div>
    
    <button class="back-button" @click="goBack">← Back to List</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AnimeService from '../services/anime-service';
import type { Anime } from '../types/anime';

declare global {
  interface Window {
    DISQUS: any;
  }
}

interface DisqusConfig {
  page: {
    url: string;
    identifier: string;
    title: string;
  }
}

export default defineComponent({
  name: 'AnimeDetailPage',
  data() {
    return {
      anime: null as Anime | null,
      loading: true
    };
  },
  methods: {
    async fetchAnimeDetails() {
      const id = Number(this.$route.params.id);
      if (isNaN(id)) {
        this.loading = false;
        return;
      }
      
      this.anime = await AnimeService.getAnimeById(id);
      this.loading = false;
      
      if (this.anime) {
        this.initDisqus();
      }
    },
    formatDate(dateString: string | null): string {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    initDisqus() {
      const disqusShortname = 'retro-anime-vercel-app'; // Replace with your actual Disqus shortname
      const animeId = this.anime?.mal_id;
      const animeTitle = this.anime?.title || 'Anime Detail';
      
      // Use arrow function to preserve the context of 'this'
      const disqusConfig = () => {
        return {
          page: {
            url: window.location.href,
            identifier: `anime_${animeId}`,
            title: animeTitle
          }
        } as DisqusConfig;
      };
      
      if (window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: disqusConfig
        });
      } else {
        const d = document;
        const s = d.createElement('script');
        s.src = `https://${disqusShortname}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', `${+new Date()}`);
        (d.head || d.body).appendChild(s);
        
        // Set DISQUS config globally
        (window as any).disqus_config = disqusConfig;
      }
    },
    goBack() {
      this.$router.back();
    }
  },
  async mounted() {
    await this.fetchAnimeDetails();
  },
  watch: {
    '$route.params.id': async function() {
      this.loading = true;
      await this.fetchAnimeDetails();
    }
  }
});
</script>

<style scoped>

@media (max-width: 768px) {
  .anime-header {
    flex-direction: column;
  }
  
  .anime-poster {
    margin-right: 0;
    margin-bottom: 20px;
    flex: none;
    width: 200px;
    max-width: 100%;
    align-self: center;
  }
  
  .trailer-embed iframe {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .trailer-embed iframe {
    height: 200px;
  }
  
  .anime-info h1 {
    font-size: 24px;
  }
  
  .anime-info h2, .anime-info h3 {
    font-size: 18px;
  }
}

.anime-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: #eee;
}

.loading, .error-message {
  text-align: center;
  padding: 50px;
}

.anime-header {
  display: flex;
  margin-bottom: 30px;
}

.anime-poster {
  flex: 0 0 250px;
  margin-right: 30px;
}

.anime-poster img {
  width: 100%;
  border: 1px solid #444;
}

.anime-info {
  flex: 1;
}

.anime-info h1 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #eee;
}

.anime-info h2, .anime-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #aaa;
  font-weight: normal;
}

.anime-stats {
  margin: 20px 0;
}

.anime-stats p {
  margin: 5px 0;
}

.anime-genres {
  margin-top: 15px;
}

.genre-tag {
  display: inline-block;
  padding: 3px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  background: #444;
  border-radius: 3px;
  font-size: 14px;
}

.anime-synopsis {
  margin-bottom: 30px;
  line-height: 1.6;
}

.anime-trailer {
  margin-bottom: 30px;
}

.trailer-embed {
  margin-top: 15px;
}

.anime-comments {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #444;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 15px;
  background: #333;
  border: 1px solid #444;
  color: #eee;
  cursor: pointer;
}
</style>