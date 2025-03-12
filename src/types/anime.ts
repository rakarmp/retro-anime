export interface Anime {
    mal_id: number;
    title: string;
    title_english: string;
    title_japanese: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      }
    };
    status: string;
    aired: {
      from: string;
      to: string;
    };
    synopsis: string;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    genres: Array<{
      mal_id: number;
      name: string;
    }>;
    trailer: {
      youtube_id: string;
      url: string;
      embed_url: string;
    };
  }
  
