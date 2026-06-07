export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'cout-construction-villa-maroc-2026',
    title: 'Prix de construction au Maroc 2026 : Combien coûte une villa par m² ?',
    excerpt: 'Bghiti tbni villa ? Découvrez les prix réels du gros œuvre et des finitions au Maroc en 2026. Guide complet pour éviter les arnaques.',
    content: `
      <h2>Budget de construction au Maroc : Ce qu'il faut savoir</h2>
      <p>La question qui revient le plus souvent est : <strong>"Ch-hal kayswa m² dyal lbni ?"</strong>. En 2026, avec l'augmentation du prix des matériaux comme le fer et le ciment, il est crucial de bien calculer son budget avant de commencer.</p>
      
      <h3>1. Prix du Gros Œuvre (L-mizanya dyal lbni)</h3>
      <p>Pour le gros œuvre seul (fondations, dalles, murs), comptez entre <strong>1 800 MAD et 2 500 MAD par m²</strong> couvert. Ce prix varie selon la complexité du plan d'architecte et la nature du terrain.</p>
      
      <h3>2. Finition : Du standard au luxe</h3>
      <p>C'est ici que le budget peut exploser. Les finitions (carrelage, marbre, électricité, menuiserie) coûtent généralement entre <strong>2 500 MAD et 6 000 MAD par m²</strong> supplémentaires.</p>
      <ul>
        <li><strong>Standard :</strong> Finition propre avec des matériaux locaux.</li>
        <li><strong>Haut Standing :</strong> Marbre, bois noble, domotique et aluminium haut de gamme.</li>
      </ul>

      <div class="bg-green-50 p-6 rounded-2xl my-8 border border-green-100">
        <h4 class="text-forest font-bold mb-2">Conseil InvestAqary :</h4>
        <p class="text-sm">Utilisez toujours un contrat écrit avec votre entrepreneur et ne payez jamais la totalité avant la réception de chaque phase. Pour une estimation précise, essayez notre <a href="/simulateur">Simulateur de budget</a>.</p>
      </div>
    `,
    image: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?q=80&w=1200&auto=format&fit=crop',
    date: '15 Mai 2026',
    author: 'Équipe InvestAqary',
    category: 'Guides de Prix',
    tags: ['Prix Construction', 'Villa Maroc', 'Gros Œuvre', 'Budget'],
    readTime: '8 min'
  },
  {
    id: 2,
    slug: 'comment-recruter-maalem-confiance',
    title: 'Comment trouver un Maalem de confiance au Maroc ? 5 astuces',
    excerpt: 'Mabghitich l-machakil m3a l-m3allem ? Voici comment recruter les meilleurs artisans pour vos travaux de rénovation sans stress.',
    content: `
      <h2>Le défi de trouver un bon Maalem</h2>
      <p>Tout le monde au Maroc a déjà eu une mauvaise expérience avec un "m3allem" : retard, travail bâclé ou disparition après l'avance. Mais ne vous inquiétez pas, il existe des solutions.</p>
      
      <h3>1. Demandez un Portfolio (T-sawer dyal l-khdma)</h3>
      <p>Un Maalem fier de son travail aura toujours des photos de ses réalisations sur son téléphone ou sur son profil <a href="/maalems">InvestaQary</a>. Vérifiez la propreté des finitions.</p>
      
      <h3>2. Ne travaillez jamais sans devis détaillé</h3>
      <p>Même pour de petits travaux de plomberie ou de peinture, exigez un récapitulatif des prix. Cela évite les surprises du type "hadchi madernahch f l-awal".</p>

      <h3>3. La règle des 3 devis</h3>
      <p>Ne signez jamais avec le premier venu. Comparez au moins 3 prestataires pour comprendre le prix du marché. Sur notre plateforme, vous pouvez <a href="/entreprises">demander des devis gratuits</a> en un clic.</p>
    `,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    date: '10 Mai 2026',
    author: 'Expert BTP',
    category: 'Conseils Travaux',
    tags: ['Maalem', 'Artisanat', 'Rénovation', 'Maroc'],
    readTime: '5 min'
  },
  {
    id: 3,
    slug: 'tendances-cuisine-moderne-maroc',
    title: 'Tendances Cuisine 2026 : Quel budget pour une cuisine équipée ?',
    excerpt: 'Découvrez les modèles de cuisines les plus demandés à Casablanca et Rabat. Prix des matériaux et conseils d\'aménagement.',
    content: `
      <h2>La cuisine : Le cœur de la maison marocaine</h2>
      <p>F 2026, la tendance est aux cuisines ouvertes et minimalistes. Mais combien ça coûte réellement d'installer une cuisine moderne au Maroc ?</p>
      
      <h3>1. Les matériaux qui durent</h3>
      <p>Pour les façades, le <strong>MDF High Gloss</strong> ou l'<strong>Aluminium</strong> restent les favoris pour leur résistance à l'humidité. Pour le plan de travail, le quartz ou le granit sont indispensables.</p>
      
      <h3>2. Estimation des prix</h3>
      <ul>
        <li><strong>Petite cuisine (moins de 3m) :</strong> Entre 15 000 MAD et 25 000 MAD.</li>
        <li><strong>Cuisine moyenne :</strong> Entre 30 000 MAD et 55 000 MAD.</li>
        <li><strong>Cuisine de luxe :</strong> Peut dépasser les 100 000 MAD avec l'électroménager encastré.</li>
      </ul>

      <p>Besoin d'un cuisiniste qualifié ? Consultez notre liste de <a href="/entreprises?category=Pose de cuisine">spécialistes en cuisine</a>.</p>
    `,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    date: '05 Mai 2026',
    author: 'Designer',
    category: 'Design Intérieur',
    tags: ['Cuisine', 'Prix Cuisine', 'Aménagement', 'Déco'],
    readTime: '6 min'
  }
];

export const getPostBySlug = (slug?: string) => blogPosts.find(p => p.slug === slug);
