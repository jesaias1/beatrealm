export type RealmVisualStyle =
  | "glitch"
  | "dark"
  | "rage"
  | "dreamy"
  | "minimal";

export type RealmMood =
  | "dark"
  | "aggressive"
  | "sad"
  | "dreamy"
  | "futuristic"
  | "underground"
  | "cinematic"
  | "weird";

export type RealmGenre =
  | "trap"
  | "rage"
  | "drill"
  | "ambient"
  | "electronic"
  | "hyperpop"
  | "experimental"
  | "boom bap"
  | "other";

export type Producer = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarTone: string;
};

export type Realm = {
  id: string;
  slug: string;
  title: string;
  producer: Producer;
  genre: RealmGenre;
  mood: RealmMood;
  bpm?: number;
  visualStyle: RealmVisualStyle;
  coverGradient: string;
  accentColor: string;
  description: string;
  featured?: boolean;
};

export type RealmDraft = {
  title: string;
  producerName: string;
  genre: RealmGenre;
  mood: RealmMood;
  bpm: string;
  visualStyle: RealmVisualStyle;
  description: string;
  coverPlaceholderId: string;
  audioFileNameMock: string;
};

export type PersistedRealm = {
  id: string;
  slug: string;
  title: string;
  producerName: string;
  producerSlug: string;
  genre: RealmGenre;
  mood: RealmMood;
  bpm?: number;
  visualStyle: RealmVisualStyle;
  description?: string;
  audioUrl: string;
  audioOriginalName: string;
  audioMimeType: string;
  audioSize: number;
  coverUrl?: string;
  coverOriginalName?: string;
  coverMimeType?: string;
  coverSize?: number;
  coverPlaceholderId?: string;
  createdAt: string;
  updatedAt: string;
  /** Phase 8: Realm source — 'local' for filesystem, 'cloud' for Supabase */
  source?: "local" | "cloud";
  /** Phase 8: Supabase user ID of the Realm owner */
  ownerId?: string;
  /** Phase 8: Storage path in Supabase bucket */
  audioPath?: string;
  /** Phase 8: Storage path in Supabase bucket */
  coverPath?: string;
  /** Phase 8: Whether the Realm is publicly visible */
  isPublic?: boolean;
};

export type CreateRealmInput = {
  title: string;
  producerName: string;
  genre: RealmGenre;
  mood: RealmMood;
  bpm?: number;
  visualStyle: RealmVisualStyle;
  description?: string;
  coverPlaceholderId?: string;
  audioFile: File;
  coverFile?: File;
};
