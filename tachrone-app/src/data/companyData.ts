export type Offer = {
  icon: string;
  title: string;
  price: string;
  meta: string;
  desc: string;
  delivery: string;
};

export type CompanyData = {
  slug: string;
  name: string;
  initials: string;
  city: string;
  category: string;
  badge: string;
  icon: string;
  rating: string;
  reviewCount: string;
  area: string;
  price: string;
  unit: string;
  minOrder: string;
  shortDescription: string;
  longDescription: string;
  speciality: string;
  zone: string;
  delay: string;
  availability: string;
  experience: string;
  team: string;
  projects: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  ice?: string;
  reviewAuthor: string;
  reviewAvatar: string;
  reviewDate: string;
  reviewText: string;
  bars: [number, number, number, number, number];
  offers: Offer[];
};

export type Project = {
  slug: string;
  title: string;
  title_ar: string;
  subtitle: string;
  subtitle_ar: string;
  description: string;
  description_ar: string;
  companyName: string;
  companyName_ar: string;
  companySlug: string;
  companyInitials: string;
  city: string;
  city_ar: string;
  category: string;
  category_ar: string;
  images: string[];
  rating: string;
  reviewCount: string;
  bars: [number, number, number, number, number];
};

export type EnterpriseMenuItem = {
  label: string;
  icon: string;
  slug: string;
};

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const buildInitials = (label: string) =>
  label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'TP';

const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fes', 'Meknes'];

const buildGenericCompany = (item: EnterpriseMenuItem, index: number): CompanyData => {
  const city = cities[index % cities.length];
  const initials = buildInitials(item.label);

  return {
    slug: item.slug,
    name: `Atlas ${item.label}`,
    initials,
    city,
    category: item.label,
    badge: item.label,
    icon: '🏢',
    rating: (4.6 + (index % 4) * 0.1).toFixed(1),
    reviewCount: `${9 + (index % 10)} avis`,
    area: `${city} et regions proches`,
    price: `${700 + index * 25} MAD - ${3500 + index * 180} MAD`,
    unit: '/ prestation',
    minOrder: 'Commande min: 1 projet',
    shortDescription: `Entreprise specialisee dans ${item.label.toLowerCase()} avec accompagnement, conseil et execution sur mesure.`,
    longDescription: `Atlas ${item.label} propose des prestations professionnelles en ${item.label.toLowerCase()} pour les projets residentiels et professionnels. L equipe intervient de l etude jusqu a la realisation avec suivi, qualite d execution et respect des delais.`,
    speciality: item.label,
    zone: `${city}, region et villes voisines`,
    delay: '2 a 7 jours selon projet',
    availability: 'Disponible sur devis',
    experience: `${6 + (index % 9)} ans`,
    team: `${5 + (index % 12)} personnes`,
    projects: `${35 + index * 3}+`,
    phone: `+212 6${70 + index}${Math.floor(10 + index * 3)} ${Math.floor(10 + index * 7)}`,
    email: `${item.slug.replace(/[^a-z0-9]/gi, '')}@investaqary.ma`,
    website: `https://www.${item.slug}.ma`,
    address: `${city}, Maroc`,
    reviewAuthor: 'Client InvestAqary',
    reviewAvatar: 'C',
    reviewDate: '01/08/2025 11:11',
    reviewText: `Tres bon service en ${item.label.toLowerCase()}, equipe serieuse et resultat propre.`,
    bars: [88, 22, 8, 3, 1],
    offers: [
      {
        icon: '🛠️',
        title: `${item.label} standard`,
        price: `${500 + index * 20} MAD - ${1900 + index * 80} MAD`,
        meta: 'Min: 1 intervention',
        desc: `Prestation standard pour ${item.label.toLowerCase()} avec finition soignee.`,
        delivery: 'Devis sous 24h',
      },
      {
        icon: '📐',
        title: `${item.label} premium`,
        price: `${900 + index * 30} MAD - ${2600 + index * 100} MAD`,
        meta: 'Min: 1 projet',
        desc: `Solution premium avec accompagnement complet en ${item.label.toLowerCase()}.`,
        delivery: 'Visite gratuite',
      },
      {
        icon: '🚚',
        title: `${item.label} sur mesure`,
        price: `${1100 + index * 35} MAD - ${3200 + index * 120} MAD`,
        meta: 'Min: 1 lot',
        desc: `Execution sur mesure selon contraintes techniques du projet.`,
        delivery: 'Equipe disponible',
      },
      {
        icon: '✅',
        title: `Maintenance ${item.label}`,
        price: `${350 + index * 15} MAD - ${1200 + index * 60} MAD`,
        meta: 'Min: 1 passage',
        desc: `Suivi, entretien et ajustements for ${item.label.toLowerCase()}.`,
        delivery: 'Under 48h',
      },
    ],
  };
};

export const enterpriseMenuSections: EnterpriseMenuItem[][] = [
  [
    { label: 'Aménagement terrasse / Véranda', icon: 'ti-tent', slug: slugify('Aménagement terrasse / Véranda') },
    { label: 'Ameublement', icon: 'ti-armchair', slug: slugify('Ameublement') },
    { label: 'Architecte', icon: 'ti-ruler-2', slug: slugify('Architecte') },
    { label: "Architecte d'intérieur", icon: 'ti-home-2', slug: slugify("Architecte d'intérieur") },
    { label: "Bureau d'études", icon: 'ti-briefcase', slug: slugify("Bureau d'études") },
    { label: 'Bureau de contrôle', icon: 'ti-shield-check', slug: slugify('Bureau de contrôle') },
    { label: 'Gros œuvres', icon: 'ti-crane', slug: slugify('Gros œuvres') },
    { label: 'Infographie 3D / Maquette', icon: 'ti-3d-cube-sphere', slug: slugify('Infographie 3D / Maquette') },
    { label: 'Installation ascenseurs', icon: 'ti-elevator', slug: slugify('Installation ascenseurs') },
    { label: 'Installation charpente métallique', icon: 'ti-building-bridge', slug: slugify('Installation charpente métallique') },
    { label: 'Installation climatisation', icon: 'ti-snowflake', slug: slugify('Installation climatisation') },
    { label: 'Installation de piscine', icon: 'ti-pool', slug: slugify('Installation de piscine') },
  ],
  [
    { label: 'Installation de plomberie', icon: 'ti-droplet', slug: slugify('Installation de plomberie') },
    { label: 'Installation de revêtement mural', icon: 'ti-border-all', slug: slugify('Installation de revêtement mural') },
    { label: 'Installation de revêtement sol', icon: 'ti-border-all', slug: slugify('Installation de revêtement sol') },
    { label: 'Installation domotique', icon: 'ti-smart-home', slug: slugify('Installation domotique') },
    { label: 'Installation électrique', icon: 'ti-bolt', slug: slugify('Installation électrique') },
    { label: 'Installation système audio', icon: 'ti-speakerphone', slug: slugify('Installation système audio') },
    { label: 'Laboratoire', icon: 'ti-microscope', slug: slugify('Laboratoire') },
    { label: 'Location engin de chantier', icon: 'ti-truck-delivery', slug: slugify('Location engin de chantier') },
    { label: 'Nettoyage de chantier', icon: 'ti-trash', slug: slugify('Nettoyage de chantier') },
    { label: 'Paysagiste', icon: 'ti-leaf', slug: slugify('Paysagiste') },
    { label: "Pose d'aluminium", icon: 'ti-window', slug: slugify("Pose d'aluminium") },
    { label: 'Pose de carrelage', icon: 'ti-layout-grid', slug: slugify('Pose de carrelage') },
  ],
  [
    { label: 'Pose de cuisine', icon: 'ti-soup', slug: slugify('Pose de cuisine') },
    { label: 'Pose de faux plafond', icon: 'ti-layers-intersect', slug: slugify('Pose de faux plafond') },
    { label: 'Pose de fenêtres', icon: 'ti-window', slug: slugify('Pose de fenêtres') },
    { label: 'Pose de menuiserie', icon: 'ti-hammer', slug: slugify('Pose de menuiserie') },
    { label: 'Pose de peinture', icon: 'ti-palette', slug: slugify('Pose de peinture') },
    { label: 'Pose de vitres', icon: 'ti-square', slug: slugify('Pose de vitres') },
    { label: 'Pose isolation / Étanchéité', icon: 'ti-shield-lock', slug: slugify('Pose isolation / Étanchéité') },
    { label: 'Topographe', icon: 'ti-map-pin', slug: slugify('Topographe') },
    { label: 'Transport', icon: 'ti-truck', slug: slugify('Transport') },
    { label: "Travaux d'aménagement", icon: 'ti-tools', slug: slugify("Travaux d'aménagement") },
    { label: 'Travaux publics', icon: 'ti-road', slug: slugify('Travaux publics') },
    { label: 'Vidéo et photo immobilière', icon: 'ti-camera', slug: slugify('Vidéo et photo immobilière') },
  ],
];

export const matiereCategories = [
  { label: "Aluminium", icon: "ti-box-margin" },
  { label: "Aménagement extérieur", icon: "ti-trees" },
  { label: "Ascenseurs", icon: "ti-elevator" },
  { label: "Automatisme", icon: "ti-settings" },
  { label: "Bâtiment modulaire", icon: "ti-building-factory" },
  { label: "Cache rideau", icon: "ti-blinds" },
  { label: "Carrelage", icon: "ti-border-all" },
  { label: "Climatisation/chauffage", icon: "ti-air-conditioning" },
  { label: "Cuisine", icon: "ti-cooker" },
  { label: "EPI", icon: "ti-helmet" },
  { label: "Etanchéité", icon: "ti-droplet-filled" },
  { label: "Ferronnerie / Métallurgie", icon: "ti-fence" },
  { label: "Incendie", icon: "ti-flame" },
  { label: "Isolation", icon: "ti-temperature" },
  { label: "Luminaire", icon: "ti-bulb" },
  { label: "Matériaux de construction", icon: "ti-bricks" },
  { label: "Matériel de chantier", icon: "ti-crane" },
  { label: "Matériel électrique", icon: "ti-plug" },
  { label: "Menuiserie", icon: "ti-cut" },
  { label: "Peinture", icon: "ti-paint" },
  { label: "Pierre naturelle", icon: "ti-diamond" },
  { label: "Piscine", icon: "ti-pool" },
  { label: "Plâtre", icon: "ti-border-radius" },
  { label: "Plomberie", icon: "ti-tool" },
  { label: "Quincaillerie", icon: "ti-screw" },
  { label: "Revêtement mur", icon: "ti-wall" },
  { label: "Revêtement sol", icon: "ti-texture" },
  { label: "Rideaux magasins", icon: "ti-door-enter" },
  { label: "Salle de bain/sanitaire", icon: "ti-bath" },
  { label: "Système audio", icon: "ti-speakerphone" },
  { label: "Système de surveillance", icon: "ti-camera" },
  { label: "Vitrerie", icon: "ti-window" },
  { label: "Aménagement terrasse", icon: "ti-tent" }
].sort((a, b) => a.label.localeCompare(b.label));

export const maalemCategories = [
  { label: "Plombier", icon: "ti-droplet" },
  { label: "Électricien", icon: "ti-bolt" },
  { label: "Menuisier", icon: "ti-hammer" },
  { label: "Peintre", icon: "ti-palette" },
  { label: "Carreleur", icon: "ti-layout-grid" },
  { label: "Plâtrier", icon: "ti-border-radius" },
  { label: "Étanchéiste", icon: "ti-droplet-filled" },
  { label: "Maçon", icon: "ti-wall" },
  { label: "Ferronnier", icon: "ti-fence" },
  { label: "Jardinier / Paysagiste", icon: "ti-leaf" },
  { label: "Climatisation", icon: "ti-snowflake" },
  { label: "Ascensoriste", icon: "ti-elevator" },
  { label: "Cuisiniste", icon: "ti-soup" },
  { label: "Vitrier", icon: "ti-square" },
  { label: "Topographe", icon: "ti-map-pin" },
  { label: "Nettoyage", icon: "ti-trash" },
  { label: "Domotique", icon: "ti-smart-home" },
  { label: "Déménagement", icon: "ti-truck" },
  { label: "Forage", icon: "ti-drilling" },
  { label: "Piscine", icon: "ti-pool" },
  { label: "Aluminium", icon: "ti-window" },
  { label: "Faux plafond", icon: "ti-layers-intersect" },
  { label: "Revêtement", icon: "ti-border-all" },
  { label: "Rénovation", icon: "ti-tools" }
].sort((a, b) => a.label.localeCompare(b.label));

const explicitCompanyData: Record<string, CompanyData> = {
  'atelier-terrasse-plus': {
    slug: 'atelier-terrasse-plus',
    name: 'Atelier Terrasse Plus',
    initials: 'AT',
    city: 'Casablanca',
    category: 'Amenagement terrasse / exterieur',
    badge: 'Amenagement Terrasse',
    icon: '🌿',
    rating: '4.9',
    reviewCount: '16 avis',
    area: 'Casablanca, Bouskoura',
    price: '850 MAD - 7 500 MAD',
    unit: '/ projet',
    minOrder: 'Commande min: 1 projet',
    shortDescription: 'Entreprise specialisee dans l amenagement de terrasses, pergolas et espaces exterieurs sur mesure.',
    longDescription:
      'Atelier Terrasse Plus realise des terrasses modernes, habillages bois, pergolas, revetements exterieurs et integrations paysageres. L entreprise accompagne chaque client du design a la pose with un suivi detaille et des finitions haut de gamme.',
    speciality: 'Terrasses, pergolas, revetement exterieur',
    zone: 'Casablanca, Dar Bouazza, Mohammedia',
    delay: '3 a 10 jours',
    availability: 'Disponible cette semaine',
    experience: '8 ans',
    team: '12 personnes',
    projects: '140+',
    reviewAuthor: 'MOUAD MMAMAD',
    reviewAvatar: 'M',
    reviewDate: '01/08/2025 11:11',
    reviewText: 'GOOD QUALITE. Terrasse propre, finition mzyana w service rapide.',
    phone: '+212 6 60 11 22 33',
    email: 'contact@atelier-terrasse-plus.ma',
    website: 'https://atelier-terrasse-plus.ma',
    address: 'Zone Industrielle, Casablanca',
    bars: [94, 18, 6, 2, 1],
    offers: [
      { icon: '🪵', title: 'Terrasse bois composite', price: '1 500 MAD - 6 000 MAD', meta: 'Min: 10 m2', desc: 'Pose terrasse exterieure resistante et elegante.', delivery: 'Devis sous 24h' },
      { icon: '☀️', title: 'Pergola aluminium', price: '3 000 MAD - 12 000 MAD', meta: 'Min: 1 unite', desc: 'Pergola moderne sur mesure pour jardin ou roof-top.', delivery: 'Visite gratuite' },
      { icon: '🪴', title: 'Amenagement jardin', price: '900 MAD - 4 800 MAD', meta: 'Min: 1 projet', desc: 'Creation d espaces verts et decor exterieur.', delivery: 'Equipe disponible' },
      { icon: '🧱', title: 'Revetement exterieur', price: '700 MAD - 3 500 MAD', meta: 'Min: 15 m2', desc: 'Habillage murs et sols exterieurs with finitions propres.', delivery: 'Materiau inclus' },
    ],
  },
  'sorelle-immo': {
    slug: 'sorelle-immo',
    name: 'SORELLE IMMO',
    initials: 'SI',
    city: 'Casablanca',
    category: 'Gros oeuvre / construction',
    badge: 'Gros oeuvres',
    icon: '🏗️',
    rating: '4.8',
    reviewCount: '18 avis',
    area: 'Casablanca, Rabat',
    price: '1 200 MAD - 6 500 MAD',
    unit: '/ service',
    minOrder: 'Commande min: 1 lot',
    shortDescription: 'Sorelle Immo accompagne les projets de gros oeuvre with une equipe experimentee and un suivi chantier rigoureux.',
    longDescription:
      'Sorelle Immo is a societe specialisee dans la construction immobiliere, la gestion de chantier and la coordination des corps d etat. L entreprise intervient sur les villas, immeubles and projets professionnels with une approche orientee qualite, delais and transparence.',
    speciality: 'Fondations, structure, beton arme',
    zone: 'Casablanca, Rabat, Mohammedia',
    delay: '2 a 6 semaines selon projet',
    availability: 'Disponible sur devis',
    experience: '12 ans',
    team: '28 personnes',
    projects: '90+',
    reviewAuthor: 'KARIM EL IDRISSI',
    reviewAvatar: 'K',
    reviewDate: '14/08/2025 09:40',
    reviewText: 'Equipe serieuse, chantier bien organise and delais respectes.',
    phone: '+212 5 28 33 77 88',
    email: 'contact@sorelle-immo.ma',
    website: 'https://sorelle-immo.ma',
    address: 'Zone Industrielle, Casablanca',
    bars: [92, 18, 8, 3, 1],
    offers: [
      { icon: '🏗️', title: 'Fondations and terrassement', price: '2 500 MAD - 15 000 MAD', meta: 'Min: 1 chantier', desc: 'Preparation du terrain and base structurelle.', delivery: 'Devis sous 24h' },
      { icon: '🧱', title: 'Montage murs and cloisons', price: '950 MAD - 4 500 MAD', meta: 'Min: 50 m2', desc: 'Maconnerie complete for habitat and commerce.', delivery: 'Visite gratuite' },
      { icon: '🏢', title: 'Dalle and plancher beton', price: '1 800 MAD - 9 500 MAD', meta: 'Min: 1 niveau', desc: 'Coulage and ferraillage selon plans techniques.', delivery: 'Equipe disponible' },
      { icon: '🔩', title: 'Charpente and renfort structurel', price: '3 200 MAD - 18 000 MAD', meta: 'Min: 1 lot', desc: 'Travaux de structure for projets neufs ou renovation.', delivery: 'Etude incluse' },
    ],
  },
  'soratco': {
    slug: 'soratco',
    name: 'SORATCO',
    initials: 'SO',
    city: 'Rabat',
    category: 'Gros oeuvre / pilotage chantier',
    badge: 'Gros oeuvres',
    icon: '🏢',
    rating: '4.7',
    reviewCount: '14 avis',
    area: 'Rabat, Sale, Kenitra',
    price: '980 MAD - 7 800 MAD',
    unit: '/ prestation',
    minOrder: 'Commande min: 1 projet',
    shortDescription: 'SORATCO gere vos travaux de gros oeuvre de la conception a la livraison with un interlocuteur unique.',
    longDescription:
      'De la conception a la realisation, SORATCO transforme vos projets en realite. L entreprise intervient sur les maisons individuelles, les plateaux bureaux and les extensions with un fort accent sur l organisation de chantier and le respect du budget.',
    speciality: 'Pilotage, coffrage, execution',
    zone: 'Rabat, Sale, Temara',
    delay: '1 a 5 semaines',
    availability: 'Disponible cette semaine',
    experience: '9 ans',
    team: '19 personnes',
    projects: '63+',
    reviewAuthor: 'SALMA B.',
    reviewAvatar: 'S',
    reviewDate: '12/09/2025 09:20',
    reviewText: 'Tres bon suivi and communication claire pendant tout le chantier.',
    phone: '+212 5 37 99 66 22',
    email: 'contact@soratco.ma',
    website: 'https://soratco.ma',
    address: 'Rabat Ville, Rue de l Industrie',
    bars: [86, 28, 10, 4, 2],
    offers: [
      { icon: '🏢', title: 'Execution gros oeuvre villa', price: '3 000 MAD - 20 000 MAD', meta: 'Min: 1 villa', desc: 'Execution structurelle with suivi hebdomadaire.', delivery: 'Devis rapide' },
      { icon: '🪚', title: 'Coffrage and ferraillage', price: '1 400 MAD - 8 500 MAD', meta: 'Min: 1 niveau', desc: 'Intervention selon plan BET and controle chantier.', delivery: 'Materiel inclus' },
      { icon: '🚚', title: 'Approvisionnement chantier', price: '700 MAD - 3 200 MAD', meta: 'Min: 1 livraison', desc: 'Coordination logistique and materiaux gros oeuvre.', delivery: 'Livraison organisee' },
      { icon: '📐', title: 'Suivi technique chantier', price: '1 000 MAD - 5 000 MAD', meta: 'Min: 1 mission', desc: 'Reporting, planning and coordination terrain.', delivery: 'Disponible' },
    ],
  },
  'ifrane-electrician': {
    slug: 'ifrane-electrician',
    name: 'Ifrane electrician',
    initials: 'IE',
    city: 'Ifrane',
    category: 'Installation electrique',
    badge: 'Electricite',
    icon: '⚡',
    rating: '4.8',
    reviewCount: '10 avis',
    area: 'Ifrane, Azrou',
    price: '300 MAD - 3 800 MAD',
    unit: '/ intervention',
    minOrder: 'Commande min: 1 intervention',
    shortDescription: 'Prestataire local for installation, maintenance and depannage electrique.',
    longDescription:
      'Ifrane electrician accompagne les particuliers and les professionnels sur les travaux electriques courants, la remise aux normes, l installation d appareillage and le cablage des nouveaux espaces.',
    speciality: 'Cablage, tableau, maintenance',
    zone: 'Ifrane, Azrou, region moyenne atlas',
    delay: 'Under 48h',
    availability: 'Disponible aujourd hui',
    experience: '7 ans',
    team: '6 personnes',
    projects: '85+',
    phone: '+212 5 53 22 44 66',
    email: 'contact@ifrane-electrician.ma',
    website: 'https://ifrane-electrician.ma',
    address: 'Bd Mohamed V, Ifrane',
    reviewAuthor: 'YASSINE H.',
    reviewAvatar: 'Y',
    reviewDate: '18/06/2025 14:05',
    reviewText: 'Reactif and propre dans le travail. Tres bonne installation electrique.',
    bars: [88, 20, 5, 2, 1],
    offers: [
      { icon: '💡', title: 'Pose appareillage', price: '300 MAD - 950 MAD', meta: 'Min: 1 piece', desc: 'Pose interrupteurs, prises and luminaires.', delivery: 'Under 24h' },
      { icon: '🧰', title: 'Maintenance tableau', price: '700 MAD - 2 200 MAD', meta: 'Min: 1 tableau', desc: 'Diagnostic and remise en etat du tableau electrique.', delivery: 'Diagnostic inclus' },
      { icon: '🔌', title: 'Cablage complet', price: '1 200 MAD - 3 800 MAD', meta: 'Min: 1 lot', desc: 'Cablage for logement, bureau ou commerce.', delivery: 'Materiau selon devis' },
      { icon: '🚨', title: 'Depannage urgent', price: '250 MAD - 800 MAD', meta: 'Min: 1 intervention', desc: 'Intervention rapide en cas de panne electrique.', delivery: 'Disponible' },
    ],
  },
  'dnz-construction': {
    slug: 'dnz-construction',
    name: 'DNZ CONSTRUCTION',
    initials: 'DNZ',
    city: 'Casablanca',
    category: 'Pose Isolation / Étanchéité',
    badge: 'Étanchéité',
    icon: '🏗️',
    rating: '4.5',
    reviewCount: '0 avis',
    area: 'Casablanca',
    price: 'Sur devis',
    unit: '',
    minOrder: 'Commande min: 1 lot',
    shortDescription: 'DNZ Étanchéité Service is une entreprise spécialisée dans l\'étanchéité and l\'isolation des toitures-terrasses forte d\'expérience dans le domaine.',
    longDescription:
      'DNZ Étanchéité Service is une entreprise spécialisée dans l\'étanchéité and l\'isolation des toitures-terrasses forte d\'expérience dans le domaine. Notre expérience and savoir-faire nous permettent de vous proposer nos services for les travaux d\'étanchéité and l\'isolation (Cuvelage, toitures terrasses, terrasses, balcons, parking, murs enterrés, toitures industrielles, piscine, les ponts ...)',
    speciality: 'Étanchéité, Isolation',
    zone: 'Casablanca, Maroc',
    delay: 'Variable',
    availability: 'Disponible',
    experience: '20 ans',
    team: '15 personnes',
    projects: '120+',
    phone: '+212661652078',
    email: 'contact@dnz-construction.ma',
    website: 'https://dnz-construction.ma',
    address: 'MANZAH ERRAHMA GR 6 IMM 6NR 24 ERRAHMA 2 DAR BOUAZZA NOUACEUR',
    ice: '003107615000074',
    reviewAuthor: 'N/A',
    reviewAvatar: 'N',
    reviewDate: 'N/A',
    reviewText: 'Aucun avis for le moment.',
    bars: [0, 0, 0, 0, 0],
    offers: [],
  },
};

const generatedCompanyData = enterpriseMenuSections
  .flat()
  .reduce<Record<string, CompanyData>>((acc, item, index) => {
    acc[item.slug] = buildGenericCompany(item, index);
    return acc;
  }, {});

export const companyData: Record<string, CompanyData> = {
  ...generatedCompanyData,
  ...explicitCompanyData,
};

export const getCompanyBySlug = (slug?: string): CompanyData => {
  if (!slug) return companyData['atelier-terrasse-plus'];
  
  // 1. Check if we have it in our data
  if (companyData[slug]) return companyData[slug];
  
  // 2. If not found, create a generic one based on the slug to avoid "nothing showing"
  const name = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    slug,
    name,
    initials: buildInitials(name),
    city: 'Casablanca',
    category: 'BTP / Construction',
    badge: 'Vérifié',
    icon: '🏢',
    rating: '4.5',
    reviewCount: '0 avis',
    area: 'Maroc',
    price: 'Sur devis',
    unit: '',
    minOrder: 'Sur mesure',
    shortDescription: `Entreprise spécialisée dans le secteur du BTP au Maroc.`,
    longDescription: `${name} is une entreprise professionnelle offrant des services de haute qualité dans le domaine de la construction and l'aménagement au Maroc. Nous nous engageons à fournir des solutions innovantes and durables for tous vos projets.`,
    speciality: 'BTP',
    zone: 'Tout le Maroc',
    delay: 'Selon projet',
    availability: 'Disponible',
    experience: '10 ans',
    team: '12 personnes',
    projects: '50+',
    phone: '+212 6 00 00 00 00',
    email: `contact@${slug}.ma`,
    website: `https://www.${slug}.ma`,
    address: 'Casablanca, Maroc',
    reviewAuthor: 'Client',
    reviewAvatar: 'C',
    reviewDate: 'N/A',
    reviewText: 'Aucun avis for le moment.',
    bars: [0, 0, 0, 0, 0],
    offers: [],
  };
};

export const projects: Project[] = [
  {
    slug: 'amenagement-minifoot-marrakech',
    title: 'Amenagement De Terrains De Minifoot',
    title_ar: 'تهيئة ملاعب كرة القدم المصغرة',
    subtitle: "Amenagement Exterieur D'un Terrain De Mini Foot",
    subtitle_ar: 'تهيئة خارجية لملعب كرة قدم مصغر',
    description: "Projet complet d'aménagement d'un terrain de mini foot à Marrakech, incluant le gazon synthétique, l'éclairage and les clôtures.",
    description_ar: 'مشروع كامل لتهيئة ملعب كرة قدم مصغر في مراكش، يشمل العشب الاصطناعي، الإضاءة والسياج.',
    companyName: 'Moukadad BuildingStar Company',
    companyName_ar: 'شركة مقداد بيلدينغ ستار',
    companySlug: 'moukadad-buildingstar',
    companyInitials: 'MB',
    city: 'Marrakech',
    city_ar: 'مراكش',
    category: 'Amenagement Terrasse / Véranda',
    category_ar: 'تهيئة التراسات / الشرفات',
    images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200'],
    rating: 'NA',
    reviewCount: '0 Avis',
    bars: [0, 0, 0, 0, 0],
  },
  {
    slug: 'amenagement-cuisine-dar-bouazza',
    title: 'AMENAGEMENT D\'UNE CUISINE A DAR BOUAZZA',
    title_ar: 'تهيئة مطبخ في دار بوعزة',
    subtitle: 'AMENAGEMENT D\'UNE CUISINE A DAR BOUAZZA',
    subtitle_ar: 'تهيئة مطبخ عصري في دار بوعزة',
    description: 'Cuisine moderne sur mesure with des matériaux de haute qualité.',
    description_ar: 'مطبخ عصري مجهز حسب المقاس بمواد عالية الجودة.',
    companyName: 'BINAABROS IMMO',
    companyName_ar: 'بناء بروس عقار',
    companySlug: 'binaabros-immo',
    companyInitials: 'BI',
    city: 'Dar Bouazza',
    city_ar: 'دار بوعزة',
    category: 'Pose de Cuisine',
    category_ar: 'تركيب المطابخ',
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200'],
    rating: '4.8',
    reviewCount: '5 Avis',
    bars: [80, 15, 5, 0, 0],
  },
  {
    slug: 'amenagement-terrain-mehdia',
    title: 'Amenagement De Terrain De Mehdia',
    title_ar: 'تهيئة ملعب المهدية',
    subtitle: 'Amenagement De Terrain De Mehdia',
    subtitle_ar: 'تهيئة ملاعب رياضية بالمهدية',
    description: 'Construction and aménagement de terrains de sport à Mehdia.',
    description_ar: 'بناء وتهيئة ملاعب رياضية في مدينة المهدية.',
    companyName: 'Moukadad BuildingStar',
    companyName_ar: 'مقداد بيلدينغ ستار',
    companySlug: 'moukadad-buildingstar',
    companyInitials: 'MB',
    city: 'Mehdia',
    city_ar: 'المهدية',
    category: 'Amenagement Terrasse / Véranda',
    category_ar: 'تهيئة التراسات / الشرفات',
    images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200'],
    rating: 'NA',
    reviewCount: '0 Avis',
    bars: [0, 0, 0, 0, 0],
  },
  {
    slug: 'villa-facade-cuisine-terrasse',
    title: 'Villa',
    title_ar: 'فيلا',
    subtitle: 'Amenagement Facade, Cuisine and Terrasse',
    subtitle_ar: 'تهيئة الواجهة، المطبخ والتراس',
    description: 'Rénovation complète d\'une villa incluant la façade and l\'intérieur.',
    description_ar: 'ترميم كامل لفيلا يشمل الواجهة والتصميم الداخلي.',
    companyName: 'IMYA AMENAGE',
    companyName_ar: 'إيميا أميناج',
    companySlug: 'imya-amenage',
    companyInitials: 'IA',
    city: 'Casablanca',
    city_ar: 'الدار البيضاء',
    category: 'Aménagement Terrasse / Véranda',
    category_ar: 'تهيئة التراسات / الشرفات',
    images: ['https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200'],
    rating: 'NA',
    reviewCount: '0 Avis',
    bars: [0, 0, 0, 0, 0],
  },
  {
    slug: 'cabinets-dentaires-mohammedia',
    title: 'Amenagement De Cabinets Dentaires',
    title_ar: 'تهيئة عيادات طب الأسنان',
    subtitle: 'Amenagement De Cabinets Dentaires A Mohammedia',
    subtitle_ar: 'تهيئة عيادات طب الأسنان بالمحمدية',
    description: 'Aménagement professionnel de cabinets dentaires with respect des normes sanitaires.',
    description_ar: 'تهيئة احترافية لعيادات طب الأسنان مع احترام المعايير الصحية.',
    companyName: 'Kotfi Comp',
    companyName_ar: 'شركة كتفي',
    companySlug: 'kotfi-comp',
    companyInitials: 'KC',
    city: 'Mohammedia',
    city_ar: 'المحمدية',
    category: 'Travaux d\'aménagement',
    category_ar: 'أشغال التهيئة',
    images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200'],
    rating: 'NA',
    reviewCount: '0 Avis',
    bars: [0, 0, 0, 0, 0],
  },
];

export const getProjectBySlug = (slug?: string) =>
  (slug && projects.find((p) => p.slug === slug)) || projects[0];

export const getProjects = () => projects;
