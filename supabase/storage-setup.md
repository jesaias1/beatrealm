# Supabase Storage Bucket Setup

BeatRealm Phase 8 uses two Supabase Storage buckets for cloud-backed Realms.

## Buckets to Create

### `realm-audio`

- **Purpose:** Stores uploaded audio files (MP3, WAV, M4A, OGG).
- **Public read:** Yes — Realm audio must be streamable by any visitor.
- **Max file size:** 50MB.

### `realm-covers`

- **Purpose:** Stores uploaded cover art images (JPG, PNG, WEBP).
- **Public read:** Yes — cover art is displayed on public Realm pages.
- **Max file size:** 10MB.

## How to Create

1. Open your Supabase project dashboard.
2. Go to **Storage** in the left sidebar.
3. Click **New bucket**.
4. Name it `realm-audio`, toggle **Public bucket** ON.
5. Repeat for `realm-covers`.

## RLS Policies

For the MVP, public read is acceptable because Realms are public.
Uploads are done through server API routes using the service role key,
so no client-side upload policies are needed.

If you want extra safety, add a policy that restricts uploads to
authenticated users (though BeatRealm handles this at the API layer):

```sql
-- Example: allow authenticated uploads to realm-audio
create policy "Authenticated users can upload audio"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'realm-audio');

-- Example: public read for realm-audio
create policy "Public read for realm-audio"
  on storage.objects for select
  using (bucket_id = 'realm-audio');
```

Repeat similarly for `realm-covers`.
