<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the admin user to associate as the author
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            // Fallback to any user if admin not found
            $admin = User::first();
        }

        if (!$admin) {
            // If still no user, don't seed
            return;
        }

        $posts = [
            [
                'title' => 'Guide complet pour construire sa villa au Maroc en 2026',
                'slug' => 'guide-complet-construire-villa-maroc',
                'category' => 'Construction',
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
                'content' => "Construire sa propre villa au Maroc est le rêve de beaucoup de familles. C'est un projet passionnant mais qui nécessite une préparation rigoureuse pour éviter les mauvaises surprises financières ou techniques. Ce guide passe en revue les étapes cruciales de la réalisation de votre projet.\n\n### 1. Le choix et l'acquisition du terrain\nLa première étape consiste à trouver un terrain constructible. Il est impératif de vérifier sa situation juridique auprès de la Conservation Foncière (titré, non-collectif) et de consulter la note de renseignements d'urbanisme pour connaître le coefficient d'occupation du sol (COS) et le gabarit autorisé (R+1, R+2).\n\n### 2. La phase de conception (Architecte & Bureau d'études)\nUne fois le terrain acquis, vous devez collaborer avec un architecte agréé pour dessiner les plans selon vos envies et la réglementation. Ensuite, le bureau d'études techniques (BET) réalisera le plan de structure en béton armé (essentiel pour la sécurité antisismique) et le topographe validera l'implantation du bâtiment sur le terrain.\n\n### 3. Les démarches administratives (Rokhas)\nTous les plans doivent être soumis via la plateforme numérique **Rokhas.ma** afin d'obtenir l'autorisation de construire. Cette procédure prend généralement entre 3 et 6 semaines selon la commune.\n\n### 4. Le Gros Œuvre (Terrassement, Fondations, Dalles)\nC'est la phase où votre villa sort de terre. Elle comprend le terrassement, le coulage des fondations, l'élévation des poteaux et le coulage des dalles en béton. Il est recommandé de faire appel à un bureau de contrôle pour valider chaque étape de coulage de béton.\n\n### 5. Les finitions (Revêtements, Électricité, Plomberie)\nC'est l'étape la plus longue et souvent la plus coûteuse. Vous devrez choisir les revêtements de sol (marbre, carrelage d'importation), les menuiseries (aluminium de haute qualité), le plâtre traditionnel ou moderne, et la peinture. N'oubliez pas d'anticiper la domotique et la climatisation centralisée avant la fermeture des faux plafonds.",
                'author_id' => $admin->id,
                'status' => 'published',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Comment bien choisir son profilé aluminium pour fenêtres et baies vitrées',
                'slug' => 'choisir-aluminium-fenetres-maroc',
                'category' => 'Matériaux',
                'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800',
                'content' => "Les baies vitrées et les fenêtres occupent une place majeure dans l'architecture moderne au Maroc, favorisant la lumière naturelle. Le choix du profilé en aluminium est déterminant pour garantir l'étanchéité, l'isolation phonique et la sécurité de votre habitation.\n\n### Les différentes gammes disponibles au Maroc\nOn distingue généralement trois grandes catégories de profilés aluminium sur le marché marocain :\n*   **La gamme économique :** Profilés fins (ex: série 40 ou 45 coulissant), souvent économiques mais limités en termes d'isolation acoustique et de résistance au vent.\n*   **La gamme intermédiaire :** Profilés robustes type *Confort* (ex: série 52 ou 70), offrant un bon rapport qualité-prix, avec double vitrage possible.\n*   **La gamme premium / importée :** Profilés avec barrière thermique (RPT - Rupture de Pont Thermique) de marques internationales (comme Reynaers, Cortizo ou Technal). Ils bloquent la chaleur extérieure en été et gardent la chaleur en hiver.\n\n### Coulissant ou Battant ?\nLe système coulissant est idéal pour les grands espaces et les baies donnant sur jardin, car il n'empiète pas sur l'espace intérieur. En revanche, le système battant (ouvrant à la française) offre une meilleure étanchéité à l'air et à l'eau, ce qui est parfait pour les zones côtières très exposées au vent et à l'humidité comme Casablanca ou Tanger.\n\n### Le choix du vitrage : Ne négligez pas le double vitrage\nLe profilé ne fait pas tout : le vitrage représente 80% de la surface. Le simple vitrage est à éviter pour les pièces de vie. Le **double vitrage** (4mm de verre / 12mm de gaz argon / 4mm de verre) réduit considérablement les bruits extérieurs et évite l'effet de serre en été.",
                'author_id' => $admin->id,
                'status' => 'published',
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Rénovation de cuisine au Maroc : Étapes clés et estimation du budget',
                'slug' => 'renovation-cuisine-maroc-budget-conseils',
                'category' => 'Rénovation',
                'image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800',
                'content' => "La cuisine est devenue le cœur battant du foyer moderne. Qu'elle soit ouverte ou fermée, sa rénovation est un projet valorisant mais complexe car elle combine plomberie, électricité, menuiserie et maçonnerie. Voici comment structurer votre projet de rénovation de cuisine au Maroc.\n\n### 1. La planification de l'espace (Triangle d'activité)\nAvant de démolir, étudiez l'agencement. Le triangle d'activité (plaques de cuisson, évier, réfrigérateur) doit être le plus fluide possible. Pensez à ajouter des prises électriques supplémentaires sur le plan de travail pour le petit électroménager.\n\n### 2. Le choix des caissons et façades\n*   **Le Bois massif :** Noble et durable, mais sensible à l'humidité s'il n'est pas traité.\n*   **Le MDF (Medium Density Fiberboard) :** C'est le plus populaire. Il offre des finitions laquées, mates ou en stratifié très modernes et faciles à nettoyer.\n*   **L'Aluminium :** De plus en plus apprécié au Maroc pour sa résistance absolue à l'humidité et sa facilité d'entretien dans les cuisines de service.\n\n### 3. Le plan de travail : Marbre ou Quartz ?\nLe plan de travail doit être robuste. Le **marbre national** (ex: marbre de Khénifra ou d'Ibiza) est magnifique mais poreux, il craint le citron et l'huile. Le **granit** noir du Zimbabwe ou d'importation est extrêmement résistant. Le **quartz** (silestone) offre un choix infini de couleurs modernes et résiste parfaitement aux taches.\n\n### Quel budget prévoir au Maroc ?\n*   **Cuisine entrée de gamme (petite taille, MDF standard) :** 15 000 à 25 000 DH.\n*   **Cuisine moyenne gamme (MDF laqué, plan de travail en granit, charnières de qualité) :** 30 000 à 60 000 DH.\n*   **Cuisine haut de gamme (Quartz, bois noble, mécanismes d'angle, grand îlot) :** Plus de 70 000 DH.",
                'author_id' => $admin->id,
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Comprendre le budget du gros œuvre pour sa villa',
                'slug' => 'comprendre-budget-gros-oeuvre-maroc',
                'category' => 'Financement',
                'image' => 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800',
                'content' => "Le gros œuvre représente l'ossature et la solidité de votre maison : fondations, poteaux, poutres, dalles et murs en briques. C'est la phase la plus importante de la construction, car une erreur sur la structure est irréversible. Au Maroc, le coût du gros œuvre varie généralement de 1 200 à 2 000 DH par mètre carré construit.\n\n### Qu'est-ce qui fait varier le prix du gros œuvre ?\nPlusieurs facteurs influencent le coût final :\n1.  **La nature du sol :** Un sol rocheux nécessite un brise-roche (plus cher en terrassement), tandis qu'un sol argileux ou sablonneux demande des fondations spéciales (semelles filantes, radier généralisé, voire micropieux) qui font grimper le coût du béton armé.\n2.  **L'épaisseur des dalles :** L'utilisation de dalles pleines ou de dalles en béton précontraint modifie le volume de béton et la quantité d'acier nécessaire.\n3.  **Le coût du fer et du ciment :** Les cours des matériaux de construction fluctuent. L'acier de construction (fer à béton) représente une part importante du budget.\n\n### Comment économiser sans risquer sa sécurité ?\n*   **Optimisez la forme de la maison :** Les formes géométriques simples (carrées ou rectangulaires) demandent moins de coffrage et d'armature que les formes complexes avec de nombreux décrochés.\n*   **Négociez directement les matériaux :** Si vous construisez en tâche (main-d'œuvre uniquement), achetez vous-même le ciment et le fer auprès de grands distributeurs pour éviter les marges des intermédiaires.\n*   **Supervisez avec un ingénieur :** Un bon plan de béton armé optimisé par un bureau d'études sérieux vous évitera le gaspillage de fer tout en garantissant la parfaite conformité antisismique.",
                'author_id' => $admin->id,
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Autorisation de construire au Maroc : Procédure et pièces à fournir',
                'slug' => 'demarches-administratives-autorisation-construire-maroc',
                'category' => 'Réglementation',
                'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800',
                'content' => "L'obtention de l'autorisation de construire est le feu vert administratif obligatoire avant le début de tout chantier de construction ou de modification structurelle au Maroc. Depuis quelques années, les démarches ont été dématérialisées pour plus de transparence.\n\n### La plateforme numérique Rokhas.ma\nDésormais, toutes les demandes d'autorisation de construire se font en ligne via le portail **Rokhas.ma**. C'est généralement votre architecte qui crée le dossier et y dépose les plans pour le compte du maître d'ouvrage (vous).\n\n### Les documents indispensables à préparer\nPour constituer votre dossier, vous devrez fournir plusieurs pièces administratives et techniques :\n*   Le certificat de propriété du terrain (datant de moins de 3 mois).\n*   Le plan cadastral du terrain délivré par l'Agence Nationale de la Conservation Foncière (ANCFCC).\n*   Le plan d'architecture complet (façades, coupes, plans de situation) signé par l'architecte.\n*   L'engagement du bureau d'études techniques (BET) pour le calcul de structure.\n*   La fiche technique remplie et signée par l'architecte et le maître d'ouvrage.\n\n### Le circuit d'approbation\nUne fois le dossier soumis, il est examiné par une commission mixte (représentants de la commune, de l'Agence Urbaine, de la Protection Civile, et des réseaux de distribution d'eau et d'électricité). Si le dossier est conforme, la commission émet un avis favorable et vous devez vous acquitter des taxes de construction auprès de la commune pour éditer votre autorisation finale.",
                'author_id' => $admin->id,
                'status' => 'published',
                'published_at' => now()->subDay(),
            ],
        ];

        foreach ($posts as $postData) {
            Post::create($postData);
        }

        $this->command->info('Blog posts seeded successfully!');
    }
}
