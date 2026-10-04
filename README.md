# LuminaStock - 4K Web Stock Photo Platform & Poller

A full-stack, Pexels-inspired stock photography platform built with **Next.js 16 (App Router)**, **TypeScript**, **TailwindCSS**, and **Supabase**.

## 🌟 Key Features

1. **Dynamic Web Poller**:
   - Live stream and poll 4K stock photos continuously from open web photo feeds.
   - Background periodic auto-poller with real-time UI indicator.
   - On-demand web feed search.

2. **Full-Stack Photography Platform**:
   - **4K Masonry Grid**: Smooth staggered masonry layout with orientation & color-adaptive placeholders.
   - **Instant Search & Deep Filtering**: Search by keyword, theme, category, aspect ratio / orientation (Landscape, Portrait, Square), and hex color swatches.
   - **Photo Modal Lightbox**:
     - High-resolution pan & zoom inspection.
     - Full EXIF Camera Specs (Camera model, lens, aperture, focal length, ISO, shutter speed, dimensions).
     - Color Palette Inspector with 1-click HEX copy.
     - Live Photo Filter Studio (Vibrant HDR, Moody B&W, Cyber Neon, Golden Hour, Cinematic Teal).
     - Multi-resolution download (4K RAW, 1080p HD, 720p Web) with celebratory confetti.
   - **Collections & Moodboards**: Create private/public boards, organize favorite stock photos, and view collection galleries.
   - **Upload & Web Importer Studio**: Upload local photos or import any direct web image URL into the catalog with custom tags and photographer credits.

3. **Supabase Integration & Architecture**:
   - Ready-to-use PostgreSQL schema in [`supabase/schema.sql`](file:///c:/PHOTO%20APP/my-app/supabase/schema.sql) for `photos`, `collections`, `likes`, and `downloads`.
   - Built-in graceful local-first storage fallback so everything works seamlessly both standalone and with live Supabase.

## 🚀 Getting Started

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Connect to Supabase (Optional)
Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
Then execute the SQL script from [`supabase/schema.sql`](file:///c:/PHOTO%20APP/my-app/supabase/schema.sql) in your Supabase SQL Editor.
