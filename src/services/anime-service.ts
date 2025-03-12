import axios from 'axios';
import type { Anime } from '../types/anime';

const API_BASE_URL = 'https://api.jikan.moe/v4';

export default {
  async getTopAnimes(page = 1, limit = 20): Promise<Anime[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/top/anime`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top animes:', error);
      return [];
    }
  },

  async searchAnimes(query: string, page = 1, limit = 20): Promise<Anime[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/anime`, {
        params: { q: query, page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching animes:', error);
      return [];
    }
  },

  async getAnimeById(id: number): Promise<Anime | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/anime/${id}/full`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching anime with id ${id}:`, error);
      return null;
    }
  },

  async getSeasonalAnimes(year: number, season: string): Promise<Anime[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/seasons/${year}/${season}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching seasonal animes for ${season} ${year}:`, error);
      return [];
    }
  }
};