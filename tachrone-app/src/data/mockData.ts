
export interface Maalem {
  id: number;
  slug: string;
  name: string;
  category: string;
  city: string;
  type: 'maalem';
  extraCategories?: string;
  description: string;
  image: string;
  verified: boolean;
  rating: number;
}

import { enterpriseMenuSections, matiereCategories } from './companyData';

export interface Company {
  id: number;
  slug: string;
  name: string;
  category: string;
  type: 'entreprise' | 'maalem';
  city: string;
  extraCategories?: string;
  description: string;
  image: string;
  isBoosted?: boolean;
  rating?: number;
  isRecent?: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  category: string;
  subCategories: string[];
  extraCategories?: string;
  description: string;
  image: string;
  logo?: string;
  yearsOfActivity?: string;
  ice?: string;
  address?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  badges?: string[];
  cities?: string;
  detailsText?: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  subCategory?: string;
  price: string;
  unit: string;
  minOrder: string;
  city: string;
  supplierName: string;
  supplierLogo: string;
  description: string;
  details: string;
  images: string[];
  rating: number;
  reviewCount: number;
  status?: 'online' | 'offline';
}

export const allMaalems: Maalem[] = [
  {
    id: 1,
    slug: "azizi-yassine",
    name: "Azizi Yassine",
    category: "Pose de Menuiserie",
    city: "Tanger",
    type: 'maalem',
    extraCategories: "+ 1 autre",
    description: "Technicien Professionnel Spécialisé Dans L'Aménagement Et La Décoration D'Intérieur. Cuisines, Dressings, Habillage Mural Tél: 0629375006 Depuis 2016",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    verified: true,
  },
  {
    id: 11,
    slug: "aluminium-pro-casa",
    name: "Ali Aluminium",
    category: "Pose d'Aluminium",
    city: "Casablanca",
    type: 'maalem',
    description: "Spécialiste en pose de fenêtres, portes et volets roulants en aluminium. Travail soigné et rapide.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    verified: true,
  },
  {
    id: 12,
    slug: "alu-design-rabat",
    name: "Maalem Brahim Alu",
    category: "Pose d'Aluminium",
    city: "Rabat",
    type: 'maalem',
    description: "Expert en menuiserie aluminium et PVC. Conception sur mesure pour villas et appartements.",
    image: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    verified: true,
  },
  {
    id: 13,
    slug: "tanger-alu-style",
    name: "Youssef Aluminium",
    category: "Pose d'Aluminium",
    city: "Tanger",
    type: 'maalem',
    description: "Installation de rideaux de verre, pergolas alu et vérandas. Service professionnel à Tanger.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500&auto=format&fit=crop",
    rating: 4.6,
    verified: false,
  },
  {
    id: 2,
    slug: "khadroub-zouheir",
    name: "Khadroub Zouheir",
    category: "Installation de Revêtement mural",
    city: "Casablanca",
    type: 'maalem',
    verified: true,
    rating: 4.9,
    description: "Avec 2 Ans d'Expérience, Je Propose Des Services Professionnels En Installation De Revêtements Muraux (Panneaux Décoratifs, PVC, MDF, Etc.) Ainsi Que La Conception Et La Pose De Meubles Suspendus De Tout Type.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "fri-yahya",
    name: "Fri Yahya",
    category: "Plâtre",
    city: "Rabat",
    type: 'maalem',
    extraCategories: "+ 1 autre",
    rating: 3.7,
    verified: false,
    description: "معلم وحرفي فني في جميع أنواع الديكورات الجبسية والأسقف المعلقة، خبرة أكثر من 15 سنة.",
    image: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "hassan-sol",
    name: "Hassan El Maalem",
    category: "Revêtement sol",
    city: "Casablanca",
    type: 'maalem',
    description: "Expert en pose de carrelage, parquet et marbre. Plus de 20 ans d'expérience dans les revêtements de sol de luxe et standard.",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb793d?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    verified: true,
  },
  {
    id: 5,
    slug: "mohamed-plombier",
    name: "Mohamed El Guerrouj",
    category: "Plomberie",
    city: "Casablanca",
    type: 'maalem',
    description: "Plombier chauffagiste certifié. Installation de sanitaires, réparation de fuites et débouchage. Service rapide 24h/7j.",
    image: "https://images.unsplash.com/photo-1581244276891-8bb09977bc22?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    verified: true,
  },
  {
    id: 6,
    slug: "youssef-electricien",
    name: "Youssef Elec",
    category: "Électricien / Électricité",
    city: "Rabat",
    type: 'maalem',
    description: "Spécialiste en installation électrique domestique et industrielle. Mise aux normes, tableaux électriques et domotique.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500&auto=format&fit=crop",
    rating: 4.6,
    verified: true,
  },
  {
    id: 7,
    slug: "amine-peintre",
    name: "Amine Déco",
    category: "Peintre / Peinture",
    city: "Marrakech",
    type: 'maalem',
    description: "Artisan peintre décorateur. Peinture intérieure/extérieure, papier peint et enduits décoratifs (Tadelakt, Stucco).",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    verified: false,
  }
];

// Helper to generate maalems for all menu categories
const generateMissingMaalems = (): Maalem[] => {
  const generated: Maalem[] = [];
  const maalemCategories = [
    "Plombier", "Électricien", "Menuisier", "Peintre", "Carreleur", "Plâtrier",
    "Étanchéiste", "Maçon", "Ferronnier", "Jardinier / Paysagiste", "Climatisation",
    "Ascensoriste", "Cuisiniste", "Vitrier", "Topographe", "Nettoyage",
    "Domotique", "Déménagement", "Forage", "Piscine", "Aluminium",
    "Faux plafond", "Revêtement", "Rénovation",
    "Automatisme", "EPI", "Incendie", "Matériaux de construction", "Quincaillerie", 
    "Rideaux magasins", "Système de surveillance", "Aménagement terrasse", 
    "Aménagement extérieur", "Bâtiment modulaire", "Étanchéité", "Isolation", 
    "Matériel de chantier", "Revêtement mur", "Salle de bain/sanitaire", "Vitrerie", 
    "Cache rideau", "Luminaire", "Matériel électrique", "Pierre naturelle", 
    "Revêtement sol", "Système audio"
  ];
  
  const existingSlugs = allMaalems.map(m => m.slug);
  const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];

  maalemCategories.forEach((cat, index) => {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    if (!existingSlugs.includes(`maalem-${slug}`)) {
      generated.push({
        id: 2000 + index,
        slug: `maalem-${slug}`,
        name: `Maalem ${cat} Pro`,
        category: cat,
        city: cities[index % cities.length],
        type: 'maalem',
        description: `Expert qualifié en ${cat.toLowerCase()} avec plus de 10 ans d'expérience. Travail soigné et respect des délais garanti.`,
        image: `https://images.unsplash.com/photo-${1510000000000 + index}?q=80&w=500&auto=format&fit=crop`,
        verified: index % 2 === 0,
        rating: 4.2 + (index % 8) * 0.1
      });
    }
  });
  
  return generated;
};

const baseMaalems = [...allMaalems];
export const allMaalemsWithGenerated: Maalem[] = [
  ...baseMaalems,
  ...generateMissingMaalems()
];

const explicitCompanies: Company[] = [
  {
    id: 101,
    slug: "dnz-construction",
    name: "DNZ CONSTRUCTION",
    category: "Pose Isolation / étanchéité",
    type: 'entreprise',
    city: "Casablanca",
    description: "DNZ Étanchéité Service est Une Entreprise Spécialisée Dans L'étanchéité Et L'isolation Des Toitures-Terrasses Forte D'expérience Dans Le Domaine.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=500&auto=format&fit=crop",
    isBoosted: true,
    rating: 4.5
  },
  {
    id: 102,
    slug: "atlas-sol",
    name: "Atlas Revêtement",
    category: "Installation de Revêtement sol",
    type: 'entreprise',
    city: "Casablanca",
    rating: 4.9,
    description: "Spécialiste des sols industriels et résidentiels. Résine, parquet, carrelage grand format.",
    image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=500&auto=format&fit=crop",
    isBoosted: true,
  },
  {
    id: 103,
    slug: "plomberie-atlas",
    name: "Atlas Plomberie & Chauffage",
    category: "Installation de plomberie",
    type: 'entreprise',
    city: "Casablanca",
    description: "Société de plomberie spécialisée dans les grands chantiers et la rénovation complète. Équipe qualifiée et matériel pro.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 104,
    slug: "atelier-terrasse-plus",
    name: "Atelier Terrasse Plus",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Marrakech",
    description: "Entreprise spécialisée dans l'aménagement de terrasses, pergolas et espaces extérieurs sur mesure.",
    image: "https://images.unsplash.com/photo-1590059132213-f91575ee300b?q=80&w=500&auto=format&fit=crop",
    rating: 4.9
  },
  {
    id: 105,
    slug: "sorelle-immo",
    name: "SORELLE IMMO",
    category: "Gros œuvres",
    type: 'entreprise',
    city: "Casablanca",
    description: "Entreprise leader en gros œuvres au Maroc. Construction de villas, bâtiments industriels et rénovations structurelles. Expertise et respect des délais.",
    image: "https://images.unsplash.com/photo-1503387762-592dec5832f2?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    isBoosted: true
  },
  {
    id: 106,
    slug: "architecte-design-plus",
    name: "Architecte Design Plus",
    category: "Architecte d'intérieur",
    type: 'entreprise', 
    city: "Rabat",
    description: "Cabinet d'architecture d'intérieur spécialisé dans le design moderne et l'optimisation d'espace. Conception 3D et suivi de chantier.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop",
    rating: 4.9
  },
  {
    id: 114,
    slug: "archi-maroc",
    name: "Archi Maroc",
    category: "Architecte",
    type: 'entreprise',
    city: "Rabat",
    description: "Cabinet d'architecture spécialisé dans la conception de maisons et villas modernes, avec plans sur mesure et suivi technique.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    isBoosted: true
  },
  {
    id: 115,
    slug: "urbanisme-casablanca",
    name: "Urbanisme Casablanca",
    category: "Architecte",
    type: 'entreprise',
    city: "Casablanca",
    description: "Bureau d'architecture pour projets urbains, résidences et rénovations avec une approche durable et esthétique marocaine.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=500&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 107,
    slug: "ifrane-electrician",
    name: "Ifrane Électricité",
    category: "Installation électrique",
    type: 'entreprise',
    city: "Ifrane",
    description: "Services d'électricité générale pour résidences et commerces. Installation, maintenance et dépannage d'urgence.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 108,
    slug: "terrasse-veranda-maroc",
    name: "Terrasse & Véranda Maroc",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise', 
    city: "Casablanca",
    description: "Conception et installation de terrasses, pergolas et vérandas sur mesure pour résidences et espaces professionnels.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    isBoosted: true
  },
  {
    id: 109,
    slug: "pergola-pro",
    name: "Pergola Pro",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Rabat",
    description: "Spécialiste de la pergola bioclimatique et des solutions extérieures pour terrasses et jardins.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop",
    rating: 4.9
  },
  {
    id: 110,
    slug: "decors-jardin",
    name: "Décor Jardin",
    category: "Paysagiste",
    type: 'entreprise',
    city: "Marrakech",
    description: "Aménagement paysager complet : jardins, terrasses végétalisées, irrigation et éclairage extérieur.",
    image: "https://images.unsplash.com/photo-1444527868271-7b7ad251166b?q=80&w=500&auto=format&fit=crop",
    rating: 4.6,
    isBoosted: true
  },
  {
    id: 111,
    slug: "studio-archi",
    name: "Studio Archi",
    category: "Architecte d'intérieur",
    type: 'entreprise',
    city: "Casablanca",
    description: "Architecture intérieure et design d'espaces contemporains avec rendu 3D et suivi de chantier.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 112,
    slug: "peinture-deco-maroc",
    name: "Peinture Déco Maroc",
    category: "Pose de Peinture",
    type: 'entreprise',
    city: "Tanger",
    description: "Travaux de peinture intérieure et extérieure, patines, enduits décoratifs et finitions haut de gamme.",
    image: "https://images.unsplash.com/photo-1533743983669-94fae6e2012b?q=80&w=500&auto=format&fit=crop",
    rating: 4.5
  },
  {
    id: 113,
    slug: "carrelage-express",
    name: "Carrelage Express",
    category: "Pose de Carrelage",
    type: 'entreprise',
    city: "Marrakech",
    description: "Pose de carrelage et faïence rapide et soignée for maisons, villas and locaux commerciaux.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500&auto=format&fit=crop",
    rating: 4.4
  },
  {
    id: 120,
    slug: "veranda-confort-casablanca",
    name: "Véranda Confort Casablanca",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Casablanca",
    description: "Experts en installation de vérandas en aluminium and bois. Solutions sur mesure for agrandir votre espace de vie with style.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    isBoosted: true
  },
  {
    id: 121,
    slug: "terrasse-luxe-marrakech",
    name: "Terrasse Luxe Marrakech",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Marrakech",
    description: "Aménagement de terrasses de luxe with piscines, pergolas bioclimatiques and mobilier extérieur haut de gamme.",
    image: "https://images.unsplash.com/photo-1590059132213-f91575ee300b?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    isBoosted: true
  },
  {
    id: 122,
    slug: "espace-exterieur-rabat",
    name: "Espace Extérieur Rabat",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Rabat",
    description: "Spécialistes de la création d'espaces extérieurs conviviaux : terrasses en bois, pergolas and cuisines d'été.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop",
    rating: 4.6
  },
  {
    id: 123,
    slug: "verre-et-soleil-tanger",
    name: "Verre & Soleil Tanger",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Tanger",
    description: "Installation de vérandas panoramiques and rideaux de verre for profiter de la vue tout au long de l'année.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500&auto=format&fit=crop",
    rating: 4.8
  },
  {
    id: 150,
    slug: "terrasse-design-maroc",
    name: "Terrasse Design Maroc",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Casablanca",
    description: "Spécialiste de l'aménagement extérieur. Conception and réalisation de terrasses en bois, pergolas and vérandas sur mesure.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
    rating: 4.9,
    isBoosted: true
  },
  {
    id: 151,
    slug: "veranda-confort-rabat",
    name: "Véranda Confort",
    category: "Aménagement terrasse / Véranda",
    type: 'entreprise',
    city: "Rabat",
    description: "Installation de vérandas and fermetures de terrasses en aluminium and verre. Confort and esthétique for votre maison.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
    rating: 4.7
  },
  {
    id: 140,
    slug: "bureau-etude-atlas",
    name: "Atlas Bureau d'Études",
    category: "Bureau d'études",
    type: 'entreprise',
    city: "Casablanca",
    description: "Bureau d'études techniques spécialisé en structure, fluides et thermique. Expertise certifiée pour vos projets de construction.",
    image: "https://images.unsplash.com/photo-1503387762-592dec5832f2?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    isBoosted: true
  },
  {
    id: 141,
    slug: "maroc-engineering-conseil",
    name: "Maroc Engineering Conseil",
    category: "Bureau d'études",
    type: 'entreprise',
    city: "Rabat",
    description: "Ingénierie et conseil en bâtiment. Nous accompagnons les maîtres d'ouvrage de la conception à la réalisation.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=500&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 130,
    slug: "atlas-transport-btp",
    name: "Atlas Transport BTP",
    category: "Transport",
    type: 'entreprise',
    city: "Casablanca",
    description: "Société spécialisée dans le transport de matériaux de construction et de déblais. Flotte moderne de camions bennes.",
    image: "https://images.unsplash.com/photo-1586333242961-21f59e28a89d?q=80&w=500&auto=format&fit=crop",
    rating: 4.6,
    isBoosted: true
  },
  {
    id: 131,
    slug: "location-maroc-engins",
    name: "Location Maroc Engins",
    category: "Location engin de chantier",
    type: 'entreprise',
    city: "Rabat",
    description: "Location de pelles, chargeuses et grues pour tous vos chantiers. Matériel récent et chauffeurs qualifiés.",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb793d?q=80&w=500&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 132,
    slug: "nettoyage-pro-chantier",
    name: "Nettoyage Pro Chantier",
    category: "Nettoyage de chantier",
    type: 'entreprise',
    city: "Casablanca",
    description: "Service de nettoyage professionnel après travaux. Évacuation des gravats et remise au propre complète.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop",
    rating: 4.5
  }
];

// Helper to generate companies for missing categories
const generateMissingCompanies = (): Company[] => {
  const generated: Company[] = [];
  const categories = enterpriseMenuSections.flat();
  
  const normalize = (str: string) => 
    str.normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '')
       .toLowerCase()
       .trim();

  const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fes", "Meknes"];
  
  categories.forEach((cat, index) => {
    // Generate at least 3 companies per category to ensure coverage
    for (let i = 0; i < 3; i++) {
      const city = i === 0 ? "Casablanca" : cities[(index + i) % cities.length];
      generated.push({
        id: 1000 + (index * 10) + i,
        slug: `${cat.slug}-${i}`,
        name: `Société ${cat.label} ${i === 0 ? 'Maroc' : i === 1 ? 'Expert' : 'Solutions'}`,
        category: cat.label,
        type: 'entreprise',
        city: city,
        description: `Expertise professionnelle en ${cat.label.toLowerCase()} au Maroc. Nous proposons des solutions de haute qualité adaptées à vos besoins spécifiques.`,
        image: `https://images.unsplash.com/photo-${1510000000000 + (index * 10) + i}?q=80&w=500&auto=format&fit=crop`,
        isBoosted: (index + i) % 3 === 0,
        rating: 4.2 + ((index + i) % 8) * 0.1,
        isRecent: (index + i) % 5 === 0
      });
    }
  });
  
  return generated;
};

export const allCompanies: Company[] = [
  ...explicitCompanies,
  ...generateMissingCompanies()
];

export const allSuppliers: Supplier[] = [
  {
    id: 201,
    name: "Sufalum",
    category: "Aluminium",
    subCategories: ["Coulissants", "Frappe", "Portes"],
    extraCategories: "+ 2 autres",
    description: "Notre Entreprise Est Spécialisée Dans La Menuiserie En Aluminium.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop",
    logo: "https://via.placeholder.com/40?text=S"
  },
  {
    id: 202,
    name: "Sol Decor Maroc",
    category: "Revêtement sol",
    subCategories: ["Parquet", "Carrelage", "Marbre"],
    description: "Importateur et distributeur de revêtements de sol haut de gamme au Maroc.",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800&auto=format&fit=crop",
    logo: "https://via.placeholder.com/40?text=SD"
  },
  {
    id: 203,
    name: "BricoPlomb",
    category: "Plomberie",
    subCategories: ["Tuyauterie", "Sanitaire", "Robinetterie"],
    description: "Fournisseur de matériel de plomberie professionnel pour artisans et particuliers.",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca1f965?q=80&w=800&auto=format&fit=crop",
    logo: "https://via.placeholder.com/40?text=BP"
  }
];

// Helper to generate suppliers for missing categories
const generateMissingSuppliers = (): Supplier[] => {
  const generated: Supplier[] = [];
  const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];
  
  matiereCategories.forEach((cat, index) => {
    // Generate 3 suppliers per category to ensure coverage
    for (let i = 0; i < 3; i++) {
      const city = i === 0 ? "Casablanca" : cities[(index + i) % cities.length];
      generated.push({
        id: 3000 + (index * 10) + i,
        name: `${cat.label} ${i === 0 ? 'Maroc' : i === 1 ? 'Distribution' : 'Pro'}`,
        category: cat.label,
        subCategories: ["Standard", "Premium", "Sur mesure"],
        description: `Fournisseur leader en ${cat.label.toLowerCase()} au Maroc. Large gamme de produits et livraison sur tout le royaume.`,
        image: `https://images.unsplash.com/photo-${1520000000000 + (index * 10) + i}?q=80&w=800&auto=format&fit=crop`,
        logo: `https://via.placeholder.com/40?text=${cat.label.charAt(0)}`,
        address: `${city}, Maroc`
      });
    }
  });
  
  return generated;
};

export const allSuppliersWithGenerated: Supplier[] = [
  ...allSuppliers,
  ...generateMissingSuppliers()
];

export const allProducts: Product[] = [
  {
    id: 301,
    slug: "makai-nogal",
    name: "Makai Nogal",
    category: "Revêtement sol",
    subCategory: "Parquet",
    price: "180",
    unit: "MAD / mètre carré",
    minOrder: "Quantité min: 1 mètre carré",
    city: "Casablanca",
    supplierName: "Mall Zellij Distribution",
    supplierLogo: "https://via.placeholder.com/40?text=MZ",
    description: "Carreaux En Grès Cérame En Effet Bois De Haute Qualité. Conçus Pour Une Utilisation Intérieure. Son Aspect Mat Offre Un Rendu Naturel Et Raffiné.",
    details: "Porcelaine, mat, dimension 23×120",
    images: [
      "https://investaqary.ma/storage/products/1715854652_1.jpg", // Using a placeholder or the one from the image if possible
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800&auto=format&fit=crop"
    ],
    rating: 0,
    reviewCount: 0
  },
  {
    id: 302,
    slug: "chauffe-eau-gaz",
    name: "Chauffe-eau Gaz 10L",
    category: "Plomberie / Chauffage",
    price: "1450",
    unit: "MAD / unité",
    minOrder: "Quantité min: 1 unité",
    city: "Rabat",
    supplierName: "BricoPlomb",
    supplierLogo: "https://via.placeholder.com/40?text=BP",
    description: "Chauffe-eau à gaz haute performance, idéal pour une famille de 4 personnes. Sécurité renforcée.",
    details: "10 Litres, Allumage automatique, Gaz butane",
    images: ["https://images.unsplash.com/photo-1585704032915-c3400ca1f965?q=80&w=800&auto=format&fit=crop"],
    rating: 4.8,
    reviewCount: 25
  },
  {
    id: 303,
    slug: "peinture-astral-vinyl",
    name: "Astral Vinyl Mat 20kg",
    category: "Peinture",
    price: "450",
    unit: "MAD / pot",
    minOrder: "Min: 1 pot",
    city: "Casablanca",
    supplierName: "Peinture Pro Maroc",
    supplierLogo: "https://via.placeholder.com/40?text=PP",
    description: "Peinture vinylique de haute qualité pour murs et plafonds. Excellente opacité.",
    details: "Couleur blanche, 20kg, Séchage rapide",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"],
    rating: 4.5,
    reviewCount: 8
  },
  {
    id: 304,
    slug: "parquet-vinyl-spc",
    name: "Parquet Vinyl Spc EVA 5mm",
    category: "Revêtement sol",
    subCategory: "Parquet stratifié",
    price: "220",
    unit: "MAD / mètre carré",
    minOrder: "Quantité min: 1 mètre carré",
    city: "Casablanca",
    supplierName: "MATERI...",
    supplierLogo: "https://via.placeholder.com/40?text=MT",
    description: "Parquet SPC – La Révolution du Revêtement de Sol. Durable, résistant à l'eau et facile à installer.",
    details: "SPC, 5mm, sous-couche EVA intégrée",
    images: ["https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800&auto=format&fit=crop"],
    rating: 4.5,
    reviewCount: 12
  },
  {
    id: 305,
    slug: "plinthe-led",
    name: "Plinthe En Polystyrène Led",
    category: "Revêtement sol",
    price: "250",
    unit: "MAD / Mètre linéaire",
    minOrder: "Min: 5 Mètres linéaires",
    city: "Rabat",
    supplierName: "CHIC DECORA...",
    supplierLogo: "https://via.placeholder.com/40?text=CD",
    description: "Plinthe en polystyrène Led direct. Apportez une touche de modernité à vos espaces.",
    details: "Polystyrène haute densité, compatible LED",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"],
    rating: 4.8,
    reviewCount: 5
  },
  {
    id: 306,
    slug: "parquet-chene-massif",
    name: "Parquet Chêne Massif Naturel",
    category: "Revêtement sol",
    subCategory: "Parquet",
    price: "450",
    unit: "MAD / mètre carré",
    minOrder: "Min: 10 mètres carrés",
    city: "Casablanca",
    supplierName: "Sol Decor Maroc",
    supplierLogo: "https://via.placeholder.com/40?text=SD",
    description: "Parquet en chêne massif d'origine européenne. Finition huilée pour un aspect authentique et chaleureux.",
    details: "Chêne véritable, épaisseur 14mm, largeur 150mm",
    images: ["https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=800&auto=format&fit=crop"],
    rating: 4.9,
    reviewCount: 15
  },
  {
    id: 307,
    slug: "parquet-stratifie-gris",
    name: "Parquet Stratifié Gris Modern",
    category: "Revêtement sol",
    subCategory: "Parquet stratifié",
    price: "165",
    unit: "MAD / mètre carré",
    minOrder: "Min: 1 mètre carré",
    city: "Rabat",
    supplierName: "BricoPlomb",
    supplierLogo: "https://via.placeholder.com/40?text=BP",
    description: "Sol stratifié haute résistance (classe AC4). Facile à poser grâce au système de clic.",
    details: "Classe AC4, épaisseur 8mm, décor gris structuré",
    images: ["https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800&auto=format&fit=crop"],
    rating: 4.6,
    reviewCount: 22
  },
  {
    id: 308,
    slug: "parquet-exotique-merbau",
    name: "Parquet Exotique Merbau",
    category: "Revêtement sol",
    subCategory: "Parquet",
    price: "680",
    unit: "MAD / mètre carré",
    minOrder: "Min: 5 mètres carrés",
    city: "Tanger",
    supplierName: "Sol Decor Maroc",
    supplierLogo: "https://via.placeholder.com/40?text=SD",
    description: "Parquet en bois exotique Merbau, extrêmement durable et résistant à l'humidité. Idéal pour un salon de luxe.",
    details: "Bois Merbau, rouge brun profond, épaisseur 12mm",
    images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop"],
    rating: 5.0,
    reviewCount: 7
  }
];

// Helper to generate products for missing categories
const generateMissingProducts = (): Product[] => {
  const generated: Product[] = [];
  const existingCategories = allProducts.map(p => p.category);
  const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];
  
  matiereCategories.forEach((cat, index) => {
    // Generate at least 5 products per category for variety
    for (let i = 1; i <= 5; i++) {
      generated.push({
        id: 4000 + (index * 10) + i,
        slug: `product-${cat.label.toLowerCase().replace(/[^a-z0-9]/gi, '-')}-${i}`,
        name: `${cat.label} ${i === 1 ? 'Standard' : i === 2 ? 'Premium' : i === 3 ? 'Eco' : i === 4 ? 'Pro' : 'Elite'}`,
        category: cat.label,
        price: `${150 + (index * 10) + (i * 100)}`,
        unit: i % 2 === 0 ? "MAD / m²" : "MAD / unité",
        minOrder: `Min: ${i * 2} unités`,
        city: cities[(index + i) % cities.length],
        supplierName: `${cat.label} Distribution ${i}`,
        supplierLogo: `https://via.placeholder.com/40?text=${cat.label.charAt(0)}`,
        description: `Ce produit de ${cat.label.toLowerCase()} est conçu pour offrir durabilité et esthétique à vos projets BTP. Haute qualité garantie.`,
        details: "Matériau certifié conforme aux normes internationales. Résistant et durable.",
        images: [`https://images.unsplash.com/photo-${1530000000000 + (index * 10) + i}?q=80&w=800&auto=format&fit=crop`],
        rating: 4.0 + (i * 0.2),
        reviewCount: 5 + (i * 3)
      });
    }
  });
  
  return generated;
};

export const allProductsWithGenerated: Product[] = [
  ...allProducts,
  ...generateMissingProducts()
];

// Combined for PrestataireList
export const allPrestataires: Company[] = [
  ...allCompanies,
  ...allMaalemsWithGenerated.map(m => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    category: m.category,
    type: 'maalem' as const,
    city: m.city,
    description: m.description,
    image: m.image,
    isBoosted: m.verified,
    rating: m.rating
  }))
];

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'pro';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface ConsultationRequest {
  id: number;
  userName: string;
  userEmail: string;
  providerName: string;
  service: string;
  status: 'pending' | 'treated' | 'cancelled';
  date: string;
}

export const allUsers: AppUser[] = [
  { id: 1, name: "Admin InvestAqary", email: "admin@investaqary.ma", role: 'admin', status: 'active', createdAt: "2024-01-01" },
  { id: 2, name: "Ahmed Benani", email: "ahmed@gmail.com", role: 'client', status: 'active', createdAt: "2024-03-15" },
  { id: 3, name: "Siham Alaoui", email: "siham@yahoo.fr", role: 'client', status: 'active', createdAt: "2024-05-10" },
  { id: 4, name: "Azizi Yassine", email: "azizi@pro.ma", role: 'pro', status: 'active', createdAt: "2024-02-20" },
  { id: 5, name: "Karim Tazi", email: "karim@gmail.com", role: 'client', status: 'active', createdAt: "2024-05-22" },
  { id: 6, name: "Driss El Alami", email: "driss@construction.ma", role: 'pro', status: 'active', createdAt: "2024-04-12" },
  { id: 7, name: "Laila Mansouri", email: "laila@gmail.com", role: 'client', status: 'suspended', createdAt: "2024-03-01" },
  { id: 8, name: "Youssef Amrani", email: "youssef@elec.ma", role: 'pro', status: 'active', createdAt: "2024-05-05" },
];

export const allConsultations: ConsultationRequest[] = [
  { id: 1, userName: "Ahmed Benani", userEmail: "ahmed@gmail.com", providerName: "Azizi Yassine", service: "Pose de Menuiserie", status: 'pending', date: "2024-05-20" },
  { id: 2, userName: "Siham Alaoui", userEmail: "siham@yahoo.fr", providerName: "DNZ CONSTRUCTION", service: "Isolation", status: 'treated', date: "2024-05-18" },
  { id: 3, userName: "Karim Tazi", userEmail: "karim@gmail.com", providerName: "Mall Zellij", service: "Revêtement sol", status: 'pending', date: "2024-05-22" },
  { id: 4, userName: "Laila Mansouri", userEmail: "laila@gmail.com", providerName: "Sorelle Immo", service: "Gros œuvres", status: 'cancelled', date: "2024-05-15" },
  { id: 5, userName: "Ahmed Benani", userEmail: "ahmed@gmail.com", providerName: "Mohamed El Guerrouj", service: "Plomberie", status: 'pending', date: "2024-05-23" },
];
