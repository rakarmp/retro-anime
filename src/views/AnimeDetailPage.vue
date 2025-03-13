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
          <iframe width="100%" height="400" :src="'https://www.youtube.com/embed/' + anime.trailer.youtube_id"
            frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>

      <div class="anime-characters" v-if="characters && characters.length">
  <h3>Characters & Voice Actors</h3>
  <div class="slider-container">
    <button class="slider-button prev" @click="slideCharacters('prev')" 
            :disabled="characterSlidePosition <= 0">
      &lt;
    </button>
    <div class="slider-content characters-slider" ref="charactersSlider">
      <div v-for="char in characters" :key="char.character.mal_id" class="character-card">
        <div class="character-info">
          <img :src="char.character.images.jpg.image_url" :alt="char.character.name" />
          <div class="character-name">
            <p>{{ char.character.name }}</p>
            <p class="character-role">{{ char.role }}</p>
          </div>
        </div>
        <div class="va-info" v-if="char.voice_actors && char.voice_actors.length">
          <div v-for="va in char.voice_actors.slice(0, 1)" :key="va.person.mal_id">
            <img :src="va.person.images.jpg.image_url" :alt="va.person.name" />
            <div class="va-name">
              <p>{{ va.person.name }}</p>
              <p class="va-language">{{ va.language }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="slider-button next" @click="slideCharacters('next')" 
            :disabled="characterSlidePosition >= characterMaxSlide">
      &gt;
    </button>
  </div>
</div>

<div class="anime-staff" v-if="staff && staff.length">
  <h3>Staff</h3>
  <div class="slider-container">
    <button class="slider-button prev" @click="slideStaff('prev')" 
            :disabled="staffSlidePosition <= 0">
      &lt;
    </button>
    <div class="slider-content staff-slider" ref="staffSlider">
      <div v-for="person in staff" :key="person.person.mal_id" class="staff-card">
        <img :src="person.person.images.jpg.image_url" :alt="person.person.name" />
        <div class="staff-info">
          <p class="staff-name">{{ person.person.name }}</p>
          <p class="staff-position">{{ person.positions.join(', ') }}</p>
        </div>
      </div>
    </div>
    <button class="slider-button next" @click="slideStaff('next')" 
            :disabled="staffSlidePosition >= staffMaxSlide">
      &gt;
    </button>
  </div>
</div>

      <div class="anime-themes" v-if="anime.theme">
        <h3>Themes</h3>
        <div class="themes-container">
          <div class="opening-themes" v-if="anime.theme.openings && anime.theme.openings.length">
            <h4>Opening Themes</h4>
            <ul>
              <li v-for="(theme, index) in anime.theme.openings" :key="'op-' + index">{{ theme }}</li>
            </ul>
          </div>
          <div class="ending-themes" v-if="anime.theme.endings && anime.theme.endings.length">
            <h4>Ending Themes</h4>
            <ul>
              <li v-for="(theme, index) in anime.theme.endings" :key="'ed-' + index">{{ theme }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="anime-episodes" v-if="episodes && episodes.length">
        <h3>Episodes</h3>
        <div class="episodes-list">
          <div v-for="episode in episodes" :key="episode.mal_id" class="episode-item">
            <div class="episode-number">#{{ episode.mal_id }}</div>
            <div class="episode-details">
              <h4>{{ episode.title }}</h4>
              <p v-if="episode.title_japanese">{{ episode.title_japanese }}</p>
              <p class="episode-aired">Aired: {{ formatDate(episode.aired) }}</p>
              <p class="episode-score" v-if="episode.score">Score: {{ episode.score }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="anime-details-extra">
        <h3>Additional Information</h3>
        <div class="extra-info-grid">
          <div class="info-item">
            <span class="info-label">Type:</span>
            <span class="info-value">{{ anime.type }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Episodes:</span>
            <span class="info-value">{{ anime.episodes || 'Unknown' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Duration:</span>
            <span class="info-value">{{ anime.duration }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Rating:</span>
            <span class="info-value">{{ anime.rating || 'Not rated' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Source:</span>
            <span class="info-value">{{ anime.source || 'Unknown' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Season:</span>
            <span class="info-value">{{ anime.season ? (anime.season.charAt(0).toUpperCase() + anime.season.slice(1)) +
              ' ' + anime.year : 'Unknown' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Studios:</span>
            <span class="info-value">{{anime.studios.map(s => s.name).join(', ') || 'Unknown'}}</span>
          </div>
        </div>
      </div>

      <div class="anime-streaming" v-if="anime.streaming && anime.streaming.length">
        <h3>Streaming Platforms</h3>
        <ul class="streaming-list">
          <li v-for="(platform, index) in anime.streaming" :key="index">
            <a :href="platform.url" target="_blank" rel="noopener noreferrer">{{ platform.name }}</a>
          </li>
        </ul>
      </div>

      <div class="anime-external" v-if="anime.external && anime.external.length">
        <h3>External Links</h3>
        <ul class="external-list">
          <li v-for="(link, index) in anime.external" :key="index">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.name }}</a>
          </li>
        </ul>
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
import type { Anime, AnimeCharacter, AnimeStaff, AnimeEpisode } from '../types/anime';

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
      loading: true,
      characters: [] as AnimeCharacter[],
      staff: [] as AnimeStaff[],
      episodes: [] as AnimeEpisode[],
      characterSlidePosition: 0,
      staffSlidePosition: 0,
      characterMaxSlide: 0,
      staffMaxSlide: 0
    };
  },
  methods: {
    async fetchAnimeDetails() {
      const id = Number(this.$route.params.id);
      if (isNaN(id)) {
        this.loading = false;
        return;
      }
      
      try {
        this.anime = await AnimeService.getAnimeById(id);
        
        // Fetch additional data
        const [characters, staff, episodes] = await Promise.all([
          AnimeService.getAnimeCharacters(id),
          AnimeService.getAnimeStaff(id),
          AnimeService.getAnimeEpisodes(id)
        ]);
        
        this.characters = characters;
        this.staff = staff;
        this.episodes = episodes;
        
        this.loading = false;
        
        if (this.anime) {
          this.initDisqus();
          // Calculate max slides after data is loaded
          this.$nextTick(() => {
            this.calculateMaxSlides();
          });
        }
      } catch (error) {
        console.error('Error fetching anime details:', error);
        this.loading = false;
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
    },
    slideCharacters(direction: 'prev' | 'next') {
      const slider = this.$refs.charactersSlider as HTMLElement;
      const cardWidth = 315; // 300px width + 15px gap
      
      if (direction === 'next' && this.characterSlidePosition < this.characterMaxSlide) {
        this.characterSlidePosition += cardWidth;
      } else if (direction === 'prev' && this.characterSlidePosition > 0) {
        this.characterSlidePosition -= cardWidth;
      }
      
      slider.scrollLeft = this.characterSlidePosition;
    },
    slideStaff(direction: 'prev' | 'next') {
      const slider = this.$refs.staffSlider as HTMLElement;
      const cardWidth = 315; // 300px width + 15px gap
      
      if (direction === 'next' && this.staffSlidePosition < this.staffMaxSlide) {
        this.staffSlidePosition += cardWidth;
      } else if (direction === 'prev' && this.staffSlidePosition > 0) {
        this.staffSlidePosition -= cardWidth;
      }
      
      slider.scrollLeft = this.staffSlidePosition;
    },
    calculateMaxSlides() {
      if (this.$refs.charactersSlider && this.characters.length) {
        const slider = this.$refs.charactersSlider as HTMLElement;
        this.characterMaxSlide = slider.scrollWidth - slider.clientWidth;
      }
      
      if (this.$refs.staffSlider && this.staff.length) {
        const slider = this.$refs.staffSlider as HTMLElement;
        this.staffMaxSlide = slider.scrollWidth - slider.clientWidth;
      }
    }
  },
  async mounted() {
    await this.fetchAnimeDetails();
    // Add resize listener
    window.addEventListener('resize', this.calculateMaxSlides);
  },
  updated() {
    this.calculateMaxSlides();
  },
  beforeUnmount() {
    // Remove event listener
    window.removeEventListener('resize', this.calculateMaxSlides);
  },
  watch: {
    '$route.params.id': async function() {
      this.loading = true;
      this.characterSlidePosition = 0;
      this.staffSlidePosition = 0;
      await this.fetchAnimeDetails();
    }
  }
});
</script>

<style scoped>
.slider-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 15px 0;
}

.slider-content {
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  width: 100%;
  gap: 15px;
  padding: 10px 0;
}

.slider-button {
  background: rgba(60, 60, 60, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  width: 36px;
  height: 36px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  z-index: 2;
}

.slider-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slider-button.prev {
  left: 5px;
}

.slider-button.next {
  right: 5px;
}

.character-card, .staff-card {
  display: flex;
  background: #2a2a2a;
  border-radius: 5px;
  overflow: hidden;
  height: 100px;
  min-width: 300px;
  flex: 0 0 auto;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .character-card, .staff-card {
    min-width: 250px;
  }
}

.characters-grid,
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.character-card,
.staff-card {
  display: flex;
  background: #2a2a2a;
  border-radius: 5px;
  overflow: hidden;
  height: 100px;
}

.character-info,
.va-info {
  display: flex;
  flex: 1;
  padding: 10px;
}

.character-info img,
.va-info img,
.staff-card img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 5px;
}

.character-name,
.va-name,
.staff-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.character-role,
.va-language,
.staff-position {
  font-size: 12px;
  color: #aaa;
}

.themes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.opening-themes,
.ending-themes {
  flex: 1;
  min-width: 300px;
}

.themes-container ul {
  padding-left: 20px;
}

.themes-container li {
  margin-bottom: 8px;
}

.episodes-list {
  margin-top: 15px;
}

.episode-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #333;
}

.episode-number {
  flex: 0 0 50px;
  font-weight: bold;
  color: #aaa;
}

.episode-details h4 {
  margin: 0 0 5px 0;
}

.episode-details p {
  margin: 3px 0;
  font-size: 14px;
}

.episode-aired,
.episode-score {
  color: #aaa;
  font-size: 12px !important;
}

.extra-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.info-item {
  padding: 8px;
  background: #2a2a2a;
  border-radius: 5px;
}

.info-label {
  font-weight: bold;
  margin-right: 5px;
}

.streaming-list,
.external-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.streaming-list li,
.external-list li {
  background: #2a2a2a;
  padding: 8px 12px;
  border-radius: 5px;
}

.streaming-list a,
.external-list a {
  color: #eee;
  text-decoration: none;
}

.streaming-list a:hover,
.external-list a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {

  .characters-grid,
  .staff-grid {
    grid-template-columns: 1fr;
  }

  .themes-container {
    flex-direction: column;
  }
}

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

  .anime-info h2,
  .anime-info h3 {
    font-size: 18px;
  }
}

.anime-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: #eee;
}

.loading,
.error-message {
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

.anime-info h2,
.anime-info h3 {
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