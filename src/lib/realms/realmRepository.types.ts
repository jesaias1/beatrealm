import type { RealmGenre, RealmMood, RealmVisualStyle } from "@/types";

/**
 * Row shape returned from the Supabase `realms` table.
 */
export type CloudRealmRow = {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  producer_name: string;
  producer_slug: string;
  genre: string;
  mood: string;
  bpm: number | null;
  visual_style: string;
  description: string | null;
  audio_url: string;
  audio_path: string;
  audio_original_name: string | null;
  audio_mime_type: string | null;
  audio_size: number | null;
  cover_url: string | null;
  cover_path: string | null;
  cover_original_name: string | null;
  cover_mime_type: string | null;
  cover_size: number | null;
  cover_placeholder_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Input for inserting a new cloud Realm.
 */
export type CloudRealmInsert = {
  title: string;
  producerName: string;
  genre: RealmGenre;
  mood: RealmMood;
  bpm?: number;
  visualStyle: RealmVisualStyle;
  description?: string;
  coverPlaceholderId?: string;
  audioUrl: string;
  audioPath: string;
  audioOriginalName: string;
  audioMimeType: string;
  audioSize: number;
  coverUrl?: string;
  coverPath?: string;
  coverOriginalName?: string;
  coverMimeType?: string;
  coverSize?: number;
};

/**
 * Row shape returned from the Supabase `fight_results` table.
 */
export type CloudFightResultRow = {
  id: string;
  realm_id: string;
  user_id: string | null;
  player_name: string | null;
  difficulty: string;
  outcome: string;
  rank: string;
  score: number;
  accuracy: number;
  max_combo: number;
  perfects: number;
  greats: number;
  goods: number;
  misses: number;
  total_prompts: number;
  duration_seconds: number | null;
  created_at: string;
};
