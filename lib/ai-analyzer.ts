import { AIAnalysisResult } from '@/types/photo';

interface KeywordRule {
  match: RegExp;
  category: string;
  title: string;
  description: string;
  mood: string;
  tags: string[];
  dominantColor: string;
  palette: string[];
  objects: string[];
}

const AI_RULES: KeywordRule[] = [
  {
    match: /mountain|alpine|fog|alps|dolomite|hike|snow|peak/i,
    category: 'Nature',
    title: 'Majestic Alpine Mountain Range in Morning Mist',
    description: 'Breathtaking high-altitude peaks surrounded by atmospheric clouds and pine forests.',
    mood: 'Epic & Serene',
    tags: ['Mountain', 'Alps', 'Snow', 'Fog', 'Wilderness', 'Landscape', 'Hiking', '4K'],
    dominantColor: '#2b2d42',
    palette: ['#2b2d42', '#8d99ae', '#edf2f4', '#3d5a80', '#98c1d9'],
    objects: ['Mountain Peak', 'Fog', 'Evergreen Trees', 'Sky']
  },
  {
    match: /neon|tokyo|cyber|cyberpunk|night|alley|cityscape|shinjuku/i,
    category: 'Urban',
    title: 'Vibrant Cyberpunk Neon Alley Reflections',
    description: 'Electric neon signage illuminating rain-drenched metropolitan streets at midnight.',
    mood: 'Futuristic & Cinematic',
    tags: ['Tokyo', 'Neon', 'Cyberpunk', 'Rain', 'Night', 'City', 'Urban', 'Metropolis'],
    dominantColor: '#8338ec',
    palette: ['#8338ec', '#ff006e', '#3a86ff', '#0a0908', '#fb5607'],
    objects: ['Neon Signage', 'Wet Asphalt', 'Architecture', 'Street Lamp']
  },
  {
    match: /ocean|wave|surf|beach|water|sea|coastal/i,
    category: 'Nature',
    title: 'Crystalline Emerald Barrel Wave at Golden Hour',
    description: 'Pristine turquoise saltwater curling beneath the warm glow of the setting sun.',
    mood: 'Dynamic & Tranquil',
    tags: ['Ocean', 'Waves', 'Surf', 'Water', 'Beach', 'Sunset', 'Emerald', 'Marine'],
    dominantColor: '#0077b6',
    palette: ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
    objects: ['Ocean Wave', 'Water Spray', 'Horizon', 'Golden Sunlight']
  },
  {
    match: /architecture|building|spiral|stairs|concrete|facade|minimal/i,
    category: 'Architecture',
    title: 'Minimalist Monolithic Spiral Staircase Geometry',
    description: 'Sculptural architectural curves and clean geometric shadows in architectural concrete.',
    mood: 'Minimalist & Modern',
    tags: ['Architecture', 'Minimalism', 'Spiral', 'Concrete', 'Geometry', 'Interior', 'Monochrome'],
    dominantColor: '#e0e1dd',
    palette: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'],
    objects: ['Spiral Staircase', 'Concrete Wall', 'Architectural Lines', 'Ambient Light']
  },
  {
    match: /galaxy|space|nebula|star|cosmos|astronomy|milky/i,
    category: 'Space',
    title: 'Deep Interstellar Galactic Nebula and Star Clusters',
    description: 'Luminous cosmic dust clouds and distant celestial bodies captured in deep space.',
    mood: 'Mysterious & Infinite',
    tags: ['Galaxy', 'Space', 'Nebula', 'Stars', 'Astronomy', 'Cosmos', 'Universe', 'Deep Sky'],
    dominantColor: '#4361ee',
    palette: ['#03071e', '#370617', '#6a040f', '#4361ee', '#7209b7'],
    objects: ['Nebula Cloud', 'Star Cluster', 'Cosmic Dust']
  },
  {
    match: /portrait|person|model|face|woman|man|fashion|studio/i,
    category: 'People',
    title: 'Editorial Studio Portrait with Prismatic Lighting',
    description: 'High-contrast studio lighting creating chromatic refraction on fashion portrait.',
    mood: 'Artistic & Sophisticated',
    tags: ['Portrait', 'Fashion', 'Studio', 'Lighting', 'Model', 'Editorial', 'Artistic'],
    dominantColor: '#ff007f',
    palette: ['#240046', '#5a189a', '#9d4edd', '#ff007f', '#e0aaff'],
    objects: ['Face', 'Eyes', 'Studio Lighting', 'Prismatic Refraction']
  },
  {
    match: /drone|aerial|topdown|atoll|island|coral/i,
    category: 'Drone',
    title: 'Top-Down Aerial Drone Perspective of Coral Atoll',
    description: 'Bird-eye perspective of vibrant turquoise reef formations in crystal-clear waters.',
    mood: 'Expansive & Vibrant',
    tags: ['Drone', 'Aerial', 'Turquoise', 'Reef', 'Ocean', 'Tropical', 'Top-Down'],
    dominantColor: '#00b4d8',
    palette: ['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef'],
    objects: ['Coral Reef', 'Turquoise Lagoon', 'Sandbank']
  },
  {
    match: /macro|botanical|dew|leaf|plant|fern|drop/i,
    category: 'Macro',
    title: 'Ultra-Macro Water Droplets on Emerald Botanical Fern',
    description: 'Pristine microscopic water beads highlighting the intricate cellular geometry of foliage.',
    mood: 'Organic & Detailed',
    tags: ['Macro', 'Botanical', 'Dew Drops', 'Fern', 'Green', 'Nature', 'Texture'],
    dominantColor: '#2d6a4f',
    palette: ['#1b4332', '#2d6a4f', '#40916c', '#74c69d', '#d8f3dc'],
    objects: ['Dew Drops', 'Leaf Veins', 'Botanical Texture']
  },
  {
    match: /coffee|latte|barista|cafe|espresso|cup/i,
    category: 'Food',
    title: 'Artisan Latte Art Pour in Porcelain Ceramic Cup',
    description: 'Perfect micro-foam poured into a delicate tulip rosette pattern at a specialty roastery.',
    mood: 'Warm & Cozy',
    tags: ['Coffee', 'Latte Art', 'Cafe', 'Barista', 'Espresso', 'Morning', 'Aesthetic'],
    dominantColor: '#7f4f24',
    palette: ['#582f0e', '#7f4f24', '#936639', '#a68a64', '#b6ad90'],
    objects: ['Coffee Cup', 'Latte Art', 'Barista Jug', 'Wooden Table']
  }
];

export async function analyzeImageWithAI(
  imageUrl: string, 
  hintTitle: string = ''
): Promise<AIAnalysisResult> {
  // Simulate AI inference delay
  await new Promise((res) => setTimeout(res, 600));

  const textToScan = `${imageUrl} ${hintTitle}`.toLowerCase();

  // Find matching rule
  let matchedRule = AI_RULES.find((r) => r.match.test(textToScan));

  if (!matchedRule) {
    // Default fallback AI analysis
    matchedRule = {
      match: /.*/,
      category: 'Nature',
      title: hintTitle || 'High-Resolution Curated Stock Photography',
      description: 'Stunning 4K photography captured with high dynamic range and rich atmospheric details.',
      mood: 'Vibrant & Atmospheric',
      tags: ['4K', 'Wallpaper', 'Curated', 'Stock', 'High Dynamic Range', 'Photography'],
      dominantColor: '#3b82f6',
      palette: ['#1e293b', '#3b82f6', '#06b6d4', '#10b981', '#f8fafc'],
      objects: ['Focal Subject', 'Ambient Lighting', 'Natural Elements']
    };
  }

  return {
    title: matchedRule.title,
    description: matchedRule.description,
    category: matchedRule.category,
    tags: matchedRule.tags,
    dominantColor: matchedRule.dominantColor,
    colorPalette: matchedRule.palette,
    mood: matchedRule.mood,
    detectedObjects: matchedRule.objects,
    confidenceScore: 0.96
  };
}
