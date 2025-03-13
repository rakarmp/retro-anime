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

  type: string;
  episodes: number | null;
  duration: string;
  rating: string;
  source: string;
  season: string;
  year: number;
  studios: Array<{
    mal_id: number;
    name: string;
  }>;
  theme: {
    openings: string[];
    endings: string[];
  };
  streaming: Array<{
    name: string;
    url: string;
  }>;
  external: Array<{
    name: string;
    url: string;
  }>;
}

export interface AnimeCharacter {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      }
    };
  };
  role: string;
  voice_actors: Array<{
    person: {
      mal_id: number;
      name: string;
      images: {
        jpg: {
          image_url: string;
        }
      };
    };
    language: string;
  }>;
}

export interface AnimeStaff {
  person: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      }
    };
  };
  positions: string[];
}

export interface AnimeEpisode {
  mal_id: number;
  title: string;
  title_japanese: string;
  aired: string;
  score: number | null;
}