# BeatRealm

BeatRealm lets music producers turn a beat and cover art into a playable, interactive music world called a Realm. **Phase 10 polishes the platform into a true public MVP with a completely redesigned landing page, dedicated no-account demo flows, producer onboarding, robust empty states, and comprehensive mobile responsive improvements.**

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Supabase Setup (Cloud Mode)

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Without env vars → local-only mode. With env vars → cloud features enabled.

### 2. Database Schema

Apply `supabase/schema.sql` in the Supabase SQL Editor. This creates profiles, realms, fight_results with RLS, indexes, and triggers.

If upgrading from Phase 8, also apply `supabase/schema-phase9.sql`.

### 3. Storage Buckets

Create two public buckets: `realm-audio` (50MB limit) and `realm-covers` (10MB limit). See `supabase/storage-setup.md`.

## Local vs Cloud Mode

| Feature | Local | Cloud |
|---------|-------|-------|
| Create Realms | ✅ `public/uploads` | ✅ Supabase Storage |
| Realm pages | ✅ `data/realms.json` | ✅ `realms` table |
| Authentication | ❌ | ✅ Email/password |
| Profile editing | ❌ | ✅ Username/display name/bio |
| Fight results | ✅ localStorage | ✅ Local + cloud |
| Leaderboards | ❌ Local only | ✅ Per-Realm with filters |
| Cloud result history | ❌ | ✅ My Cloud Scores |
| Public discovery | ❌ | ✅ Search/filter/sort |
| Edit/delete Realms | ❌ | ✅ Dashboard management |
| Publish local→cloud | ❌ | ✅ Server-side upload |
| Producer profiles | ✅ Local | ✅ Cloud + local |
| Share links | ✅ Local only | ✅ Public URLs |
| SEO metadata | Basic | ✅ Dynamic OG tags |
| Data export/import | ✅ JSON | ✅ Local data |
| Demo Experience | ✅ Local only | ✅ Local + Cloud Mock |

## Phase 10 Features

### Stronger Landing Page
- Redesigned `/` acts as a true product funnel.
- Clear "How it works" steps for visitors and producers.
- Dedicated showcase of modes (Beat Fighter and Phase 11 Remix Puzzle).
- Immediate CTA to "Try Demo Realm" without an account.

### Dedicated Demo Route (`/demo`)
- Explains the demo experience cleanly.
- `DemoRealmExperience`: handles missing audio gracefully, features a visual mock mode.
- `DemoFightPreview`: a visual-only preview of Beat Fighter, preventing audio load errors.
- `DemoDataNotice`: clearly informs users that real audio-reactive gameplay requires uploading a track.

### Producer Onboarding
- Upgraded `/create` with tips ("Use full exported beat") and clearer Local vs Cloud choices.
- `OnboardingChecklist` added to `/dashboard`. Tracks progress locally (Create, Open, Play, Publish, Share).
- Polished empty states across the app (`PolishedEmptyState`) guiding users on next steps.

### Public Realm Polish
- Better above-the-fold layout on Realm pages.
- Status badges explicitly showing "Local Link" or "Public Cloud Link".
- Producer names act as profile links.
- `SharePanel` layout improved for mobile, clarifying link boundaries.

### Fight Page Polish
- Pre-fight screen clearly explains difficulty and controls.
- Explicit messaging on whether the score will submit to the global leaderboard.

## Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Add env vars in Vercel dashboard
4. Deploy

> [!NOTE]
> Local filesystem storage (`data/realms.json`, `public/uploads`) is ephemeral on serverless. Use cloud mode for production persistence.

### Node Hosting
Works with `npm run build && npm start`. Local filesystem storage persists on disk.

## API Routes

| Route | Methods | Auth | Purpose |
|-------|---------|------|---------|
| `/api/realms` | GET, POST | No | Local Realm CRUD |
| `/api/realms/[slug]` | GET, DELETE | No | Local Realm by slug |
| `/api/local-data` | POST | No | Import local data |
| `/api/cloud/profile` | GET, PUT | Yes | Profile management |
| `/api/cloud/realms` | GET, POST | Yes* | Cloud Realm CRUD |
| `/api/cloud/realms/[slug]` | GET, PUT, DELETE | Yes* | Cloud Realm by slug |
| `/api/cloud/realms/publish-local` | POST | Yes | Publish local→cloud |
| `/api/cloud/discovery` | GET | No | Public cloud discovery |
| `/api/cloud/results` | POST | Yes | Save fight result |
| `/api/cloud/results/me` | GET | Yes | User's cloud results |
| `/api/cloud/leaderboards/[realmSlug]` | GET | No | Realm leaderboard |

*GET is public for public Realms. POST/PUT/DELETE require auth.

## Current Limitations

- No payments or subscriptions
- No AI stem splitting or Remix Puzzle (arriving in Phase 11)
- No multiplayer or social features
- No OAuth providers (Google, GitHub)
- No avatar upload
- No global cross-Realm leaderboards
- No image/video export from fight results
- No email verification customization
- Leaderboard shows all attempts, not best per user
- Local filesystem storage is ephemeral on serverless
- Deleting cloud Realm does best-effort storage cleanup

## Recommended Phase 11: Remix Puzzle Prototype

- **Stem Uploads:** Allow users to upload 4–6 stems instead of a single mix.
- **Loop Rearrangement:** A new game mode where players drag-and-drop structural loops to rebuild the original beat sequence.
- **Puzzle Logic Engine:** Validation system checking user arrangement against the producer's intended sequence.
- **Audio Worklet Polish:** Precise sample-accurate triggering for gapless stem playback.
