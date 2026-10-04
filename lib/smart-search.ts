import { Photo } from '@/types/photo';

const SYNONYM_MAP: Record<string, string[]> = {
  mountains: ['mountain', 'alpine', 'peak', 'snow', 'hike', 'fog', 'alps', 'dolomites', 'wilderness', 'landscape'],
  city: ['urban', 'tokyo', 'neon', 'cyberpunk', 'street', 'night', 'metropolis', 'skyscrapers', 'architecture'],
  futuristic: ['cyberpunk', 'neon', 'tokyo', 'technology', 'prism', 'space', 'modern', 'future'],
  ocean: ['wave', 'sea', 'water', 'surf', 'beach', 'sunset', 'marine', 'coastal', 'turquoise'],
  night: ['dark', 'neon', 'tokyo', 'stars', 'galaxy', 'space', 'aurora', 'moon'],
  calm: ['minimalism', 'nature', 'ocean', 'fog', 'mountains', 'botanical', 'fern'],
  warm: ['coffee', 'sunset', 'golden', 'desert', 'dunes', 'sahara', 'latte', 'amber'],
  space: ['galaxy', 'nebula', 'cosmos', 'universe', 'stars', 'astronomy', 'stargazing'],
  macro: ['macro', 'dew', 'droplets', 'leaf', 'fern', 'texture', 'botany', 'close-up']
};

export function performSmartSearch(photos: Photo[], query: string): Photo[] {
  if (!query || !query.trim()) return photos;

  const rawTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  
  // Expand search with synonyms
  const expandedTerms = new Set<string>(rawTerms);
  for (const term of rawTerms) {
    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (term.includes(key) || key.includes(term)) {
        synonyms.forEach(s => expandedTerms.add(s));
      }
    }
  }

  const termsArray = Array.from(expandedTerms);

  // Score each photo
  const scored = photos.map((photo) => {
    let score = 0;
    const titleLower = photo.title.toLowerCase();
    const descLower = (photo.description || '').toLowerCase();
    const categoryLower = photo.category.toLowerCase();
    const tagsLower = photo.tags.map(t => t.toLowerCase());
    const photographerLower = photo.photographer.name.toLowerCase();
    const cameraLower = (photo.exif?.camera || '').toLowerCase();

    for (const term of rawTerms) {
      if (titleLower.includes(term)) score += 10;
      if (categoryLower === term) score += 8;
      if (tagsLower.includes(term)) score += 6;
      if (descLower.includes(term)) score += 4;
      if (photographerLower.includes(term)) score += 5;
      if (cameraLower.includes(term)) score += 3;
    }

    // Synonym scoring
    for (const term of termsArray) {
      if (!rawTerms.includes(term)) {
        if (titleLower.includes(term)) score += 3;
        if (tagsLower.includes(term)) score += 2;
        if (categoryLower.includes(term)) score += 2;
        if (descLower.includes(term)) score += 1;
      }
    }

    return { photo, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.photo);
}
