<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ProfessionalProfile;
use App\Models\Project;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ... existing admin/client/pro creation code ...
        // Note: I'll just append projects to the existing pros

        // 1. Create Admin
        User::create([
            'name' => 'Admin InvestAqary',
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@investaqary.ma',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '0600000000',
        ]);

        // 2. Create some Clients
        User::create([
            'name' => 'Ahmed Client',
            'first_name' => 'Ahmed',
            'last_name' => 'El Mansouri',
            'email' => 'ahmed@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'client',
            'phone' => '0611223344',
        ]);

        // 3. Create a lot of Professionals for various categories
        $categories = [
            'Aménagement terrasse / Véranda', 'Ameublement', 'Architecte', 'Architecte d\'intérieur',
            'Bureau d\'études', 'Bureau de contrôle', 'Gros œuvres', 'Infographie 3D / Maquette',
            'Installation ascenseurs', 'Installation charpente métallique', 'Installation climatisation',
            'Installation de piscine', 'Installation de plomberie', 'Installation de revêtement mural',
            'Installation de revêtement sol', 'Installation domotique', 'Installation électrique',
            'Installation système audio', 'Laboratoire', 'Location engin de chantier',
            'Nettoyage de chantier', 'Paysagiste', 'Pose d\'aluminium', 'Pose de carrelage',
            'Pose de cuisine', 'Pose de faux plafond', 'Pose de fenêtres', 'Pose de menuiserie',
            'Pose de peinture', 'Pose de vitres', 'Pose isolation / Étanchéité', 'Topographe',
            'Transport', 'Travaux d\'aménagement', 'Travaux publics', 'Vidéo et photo immobilière'
        ];

        foreach ($categories as $index => $cat) {
            // Create 3 Pros for each category
            $variants = ['Maroc', 'Expert', 'Solutions'];
            
            foreach ($variants as $vIndex => $variant) {
                $pro = User::create([
                    'name' => "Expert $cat $variant " . ($index + 1),
                    'first_name' => 'Expert',
                    'last_name' => "$cat $variant",
                    'email' => str_replace([' ', '/', '\'', '.'], '', strtolower($cat)) . "{$index}_{$vIndex}@pro.ma",
                    'password' => Hash::make('password123'),
                    'role' => 'pro',
                    'phone' => '06' . str_pad($index . $vIndex, 8, '0', STR_PAD_LEFT),
                    'city' => $vIndex == 0 ? 'Casablanca' : ($vIndex == 1 ? 'Rabat' : 'Marrakech'),
                ]);

                ProfessionalProfile::create([
                    'user_id' => $pro->id,
                    'company_name' => "Atlas $cat $variant",
                    'type' => $vIndex % 2 == 0 ? 'entreprise' : 'maalem',
                    'category' => $cat,
                    'is_verified' => true,
                ]);

                // Add a project for each pro
                Project::create([
                    'user_id' => $pro->id,
                    'title' => "Réalisation $cat à " . $pro->city,
                    'slug' => Str::slug("Projet $cat $variant $index"),
                    'description' => "Réalisation professionnelle de $cat avec respect des normes et qualité supérieure par Atlas $cat $variant.",
                    'category' => $cat,
                    'location' => $pro->city,
                    'image' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800',
                ]);
            }
        }

        // 4. Create Maalems for specific categories
        $maalemCategories = [
            'Plombier', 'Électricien', 'Menuisier', 'Peintre', 'Carreleur', 'Plâtrier',
            'Étanchéiste', 'Maçon', 'Ferronnier', 'Jardinier / Paysagiste', 'Climatisation',
            'Ascensoriste', 'Cuisiniste', 'Vitrier', 'Topographe', 'Nettoyage',
            'Domotique', 'Déménagement', 'Forage', 'Piscine', 'Aluminium',
            'Faux plafond', 'Revêtement', 'Rénovation'
        ];

        foreach ($maalemCategories as $index => $cat) {
            // Create 3 Maalems for each category
            $names = ['Mohamed', 'Hassan', 'Brahim'];
            $cities = ['Casablanca', 'Rabat', 'Marrakech'];
            
            foreach ($names as $nIndex => $firstName) {
                $maalam = User::create([
                    'name' => "Maalem $firstName $cat",
                    'first_name' => $firstName,
                    'last_name' => "El Maalem",
                    'email' => "maalem_" . str_replace([' ', '/', '\'', '.'], '', strtolower($cat)) . "_{$nIndex}@pro.ma",
                    'password' => Hash::make('password123'),
                    'role' => 'pro',
                    'phone' => '06' . str_pad($index . $nIndex . '7', 8, '0', STR_PAD_LEFT),
                    'city' => $cities[$nIndex],
                ]);

                ProfessionalProfile::create([
                    'user_id' => $maalam->id,
                    'company_name' => "$firstName Services $cat",
                    'type' => 'maalem',
                    'category' => $cat,
                    'is_verified' => true,
                ]);

                // Add a project for each maalem
                Project::create([
                    'user_id' => $maalam->id,
                    'title' => "Travaux de $cat à " . $maalam->city,
                    'slug' => Str::slug("Projet Maalem $cat $firstName $index"),
                    'description' => "Intervention professionnelle en $cat réalisée par Maalem $firstName avec soin et qualité.",
                    'category' => $cat,
                    'location' => $maalam->city,
                    'image' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800',
                ]);
            }
        }

        // 5. Create Suppliers (Fournisseurs) and Products for Matières
        $matiereCategories = [
            'Aluminium', 'Aménagement extérieur', 'Ascenseurs', 'Automatisme', 'Bâtiment modulaire',
            'Cache rideau', 'Carrelage', 'Climatisation/chauffage', 'Cuisine', 'EPI', 'Etanchéité',
            'Ferronnerie / Métallurgie', 'Incendie', 'Isolation', 'Luminaire', 'Matériaux de construction',
            'Matériel de chantier', 'Matériel électrique', 'Menuiserie', 'Peinture', 'Pierre naturelle',
            'Piscine', 'Plâtre', 'Plomberie', 'Quincaillerie', 'Revêtement mur', 'Revêtement sol',
            'Rideaux magasins', 'Salle de bain/sanitaire', 'Système audio', 'Système de surveillance',
            'Vitrerie', 'Aménagement terrasse'
        ];

        foreach ($matiereCategories as $index => $cat) {
            // Create 3 Suppliers for each category
            $names = ['Atlas', 'Maghreb', 'Pro'];
            $cities = ['Casablanca', 'Rabat', 'Tanger'];

            foreach ($names as $nIndex => $brand) {
                $supplier = User::create([
                    'name' => "$brand $cat",
                    'first_name' => $brand,
                    'last_name' => 'Fournisseur',
                    'email' => "supplier_" . str_replace([' ', '/', '\'', '.', '-'], '', strtolower($cat)) . "_{$nIndex}@pro.ma",
                    'password' => Hash::make('password123'),
                    'role' => 'pro',
                    'phone' => '05' . str_pad($index . $nIndex . '2', 8, '0', STR_PAD_LEFT),
                    'city' => $cities[$nIndex],
                ]);

                ProfessionalProfile::create([
                    'user_id' => $supplier->id,
                    'company_name' => "$brand $cat Distribution",
                    'type' => 'fournisseur',
                    'category' => $cat,
                    'is_verified' => true,
                ]);

                // Create 2 Products for each supplier
                for ($p = 1; $p <= 2; $p++) {
                    Product::create([
                        'user_id' => $supplier->id,
                        'name' => "Produit $cat $p ($brand)",
                        'slug' => Str::slug("Produit $cat $p $brand $index"),
                        'description' => "Matériau de haute qualité pour $cat, idéal pour vos projets de construction et rénovation.",
                        'category' => $cat,
                        'sub_category' => "Gamme " . ($p == 1 ? 'Standard' : 'Premium'),
                        'price' => rand(100, 5000),
                        'unit' => $p == 1 ? 'm²' : 'unité',
                        'min_order' => '5',
                        'image' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800',
                        'status' => 'online',
                    ]);
                }
            }
        }

        echo "Seeders completed successfully! PostgreSQL is now populated with real data for ALL Entreprises, Maalems, and Matières.\n";
    }
}
