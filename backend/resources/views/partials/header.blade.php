<header x-data="{ activeMenu: 'none', isMobileMenuOpen: false }" @click.outside="activeMenu = 'none'" class="relative z-50 font-sans" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
    <div class="flex justify-between items-center px-4 md:px-10 lg:px-16 py-4 bg-white border-b border-gray-100">
        <a href="/" class="flex items-center text-xl md:text-2xl font-black text-[#3D5A40]">
            InvestAqary
        </a>

        <!-- Desktop Auth Buttons -->
        <div class="hidden lg:flex items-center gap-4 xl:gap-6">
            @auth
                <div class="relative">
                    <button @click.prevent="activeMenu = activeMenu === 'user' ? 'none' : 'user'" class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-[13px] font-bold text-gray-800 bg-white hover:bg-gray-50 transition-colors">
                        <i class="ti ti-user-circle text-lg text-[#3D5A40]"></i>
                        {{ Auth::user()->name }}
                        <i class="ti ti-chevron-down transition-transform" :class="activeMenu === 'user' ? 'rotate-180' : ''"></i>
                    </button>
                    
                    <div x-show="activeMenu === 'user'" style="display: none;" class="absolute top-full right-0 mt-2 w-[200px] bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-[100]">
                        @if(Auth::user()->role === 'admin')
                            <a href="/admin" class="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 text-sm font-bold">
                                <i class="ti ti-dashboard text-lg text-[#3D5A40]"></i> Dashboard Admin
                            </a>
                        @elseif(Auth::user()->role === 'client')
                            <a href="/dashboard/client" class="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 text-sm font-bold">
                                <i class="ti ti-layout-dashboard text-lg text-[#3D5A40]"></i> Mon Dashboard
                            </a>
                        @elseif(Auth::user()->role === 'pro')
                            <a href="/dashboard/pro" class="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 text-sm font-bold">
                                <i class="ti ti-layout-dashboard text-lg text-[#3D5A40]"></i> Espace Pro
                            </a>
                        @endif
                        <div class="border-t border-gray-100 my-1"></div>
                        <form method="POST" action="/logout" class="w-full">
                            @csrf
                            <button type="submit" class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-bold text-left">
                                <i class="ti ti-logout text-lg"></i> Se déconnecter
                            </button>
                        </form>
                    </div>
                </div>
            @else
                <a href="/inscription-pro" class="text-[13px] font-bold text-[#3D5A40] hover:underline">S'inscrire en tant que Pro</a>
                <a href="/connexion" class="px-5 py-2 border border-gray-300 rounded-md text-[13px] font-bold text-black hover:bg-gray-50 transition-colors">Se connecter</a>
                <a href="/inscription-client" class="px-5 py-2 bg-[#A7C4BC] text-black rounded-md text-[13px] font-bold hover:bg-[#8eb0a6] transition-colors shadow-sm">S'inscrire</a>
            @endauth
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden p-2 text-gray-800 hover:bg-gray-50 rounded-lg">
            <i class="ti text-2xl" :class="isMobileMenuOpen ? 'ti-x' : 'ti-menu-2'"></i>
        </button>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex justify-between items-center px-10 lg:px-16 py-3 bg-white relative z-50 border-b border-gray-100">
        <div class="flex gap-6 xl:gap-[35px] items-center">
            <a href="/" class="text-gray-800 text-[13px] font-bold hover:text-[#3D5A40] transition-colors">Accueil</a>
            
            {{-- Prestataires Dropdown --}}
            <div class="relative">
                <button @click.prevent="activeMenu = (activeMenu === 'choices' ? 'none' : 'choices')" class="text-gray-800 text-[13px] font-bold flex items-center gap-1.5 py-2.5 hover:text-[#3D5A40]">
                    Prestataires <i class="ti ti-chevron-down transition-transform" :class="activeMenu === 'choices' ? 'rotate-180' : ''"></i>
                </button>
                <div x-show="activeMenu === 'choices'" style="display: none;" class="absolute top-full left-0 w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[100]">
                    <button @click.prevent="activeMenu = 'entreprise'" class="w-full flex items-center justify-between px-5 py-2.5 text-gray-800 text-sm font-medium hover:bg-gray-50 hover:text-[#3D5A40]">
                        <span><i class="ti ti-building text-[#3D5A40] mr-2"></i> Entreprise</span>
                        <i class="ti ti-chevron-right text-gray-400 text-xs"></i>
                    </button>
                    <button @click.prevent="activeMenu = 'maalem'" class="w-full flex items-center justify-between px-5 py-2.5 text-gray-800 text-sm font-medium hover:bg-gray-50 hover:text-[#3D5A40]">
                        <span><i class="ti ti-hammer text-[#3D5A40] mr-2"></i> Maalem</span>
                        <i class="ti ti-chevron-right text-gray-400 text-xs"></i>
                    </button>
                </div>
            </div>

            {{-- Entreprise Mega Dropdown --}}
            <div x-show="activeMenu === 'entreprise'" style="display: none;" class="fixed top-[115px] left-1/2 -translate-x-1/2 w-[860px] bg-white border border-gray-200 rounded-xl shadow-2xl p-6 z-[200]">
                <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                    <h3 class="text-base font-bold text-gray-900 flex items-center gap-2"><i class="ti ti-building text-[#3D5A40]"></i> Entreprises & Agences</h3>
                    <button @click="activeMenu = 'choices'" class="text-gray-400 hover:text-gray-600 text-sm"><i class="ti ti-arrow-left mr-1"></i> Retour</button>
                </div>
                <div class="grid grid-cols-4 gap-x-6 gap-y-1">
                    <div class="space-y-0.5">
                        <a href="/entreprises?category=Aménagement terrasse / Véranda" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-sun text-[#3D5A40]"></i> Aménagement terrasse / Véranda</a>
                        <a href="/entreprises?category=Bureau d'études" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-pencil-ruler text-[#3D5A40]"></i> Bureau d'études</a>
                        <a href="/entreprises?category=Installation ascenseurs" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-elevator text-[#3D5A40]"></i> Installation ascenseurs</a>
                        <a href="/entreprises?category=Installation de plomberie" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-droplet text-[#3D5A40]"></i> Installation de plomberie</a>
                        <a href="/entreprises?category=Installation électrique" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-bolt text-[#3D5A40]"></i> Installation électrique</a>
                        <a href="/entreprises?category=Nettoyage de chantier" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-brush text-[#3D5A40]"></i> Nettoyage de chantier</a>
                        <a href="/entreprises?category=Pose de cuisine" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-chef-hat text-[#3D5A40]"></i> Pose de cuisine</a>
                        <a href="/entreprises?category=Pose de peinture" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-paint text-[#3D5A40]"></i> Pose de peinture</a>
                        <a href="/entreprises?category=Transport" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-truck text-[#3D5A40]"></i> Transport</a>
                    </div>
                    <div class="space-y-0.5">
                        <a href="/entreprises?category=Ameublement" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-armchair text-[#3D5A40]"></i> Ameublement</a>
                        <a href="/entreprises?category=Bureau de contrôle" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-clipboard-check text-[#3D5A40]"></i> Bureau de contrôle</a>
                        <a href="/entreprises?category=Installation charpente métallique" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-frame text-[#3D5A40]"></i> Inst. charpente mét.</a>
                        <a href="/entreprises?category=Installation de revêtement mural" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-wall text-[#3D5A40]"></i> Revêtement mural</a>
                        <a href="/entreprises?category=Installation système audio" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-speakerphone text-[#3D5A40]"></i> Installation système audio</a>
                        <a href="/entreprises?category=Paysagiste" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-leaf text-[#3D5A40]"></i> Paysagiste</a>
                        <a href="/entreprises?category=Pose de faux plafond" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-layout-grid text-[#3D5A40]"></i> Pose de faux plafond</a>
                        <a href="/entreprises?category=Pose de vitres" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-window text-[#3D5A40]"></i> Pose de vitres</a>
                        <a href="/entreprises?category=Travaux d'aménagement" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-home-cog text-[#3D5A40]"></i> Travaux d'aménagement</a>
                    </div>
                    <div class="space-y-0.5">
                        <a href="/entreprises?category=Architecte" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-vector-bezier text-[#3D5A40]"></i> Architecte</a>
                        <a href="/entreprises?category=Gros œuvres" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-crane text-[#3D5A40]"></i> Gros œuvres</a>
                        <a href="/entreprises?category=Installation climatisation" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-air-conditioning text-[#3D5A40]"></i> Installation climatisation</a>
                        <a href="/entreprises?category=Installation de revêtement sol" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-box text-[#3D5A40]"></i> Revêtement sol</a>
                        <a href="/entreprises?category=Laboratoire" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-flask text-[#3D5A40]"></i> Laboratoire</a>
                        <a href="/entreprises?category=Pose d'aluminium" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-layout-window text-[#3D5A40]"></i> Pose d'aluminium</a>
                        <a href="/entreprises?category=Pose de fenêtres" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-window text-[#3D5A40]"></i> Pose de fenêtres</a>
                        <a href="/entreprises?category=Pose isolation / Étanchéité" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-shield-half text-[#3D5A40]"></i> Pose isolation / Étanchéité</a>
                        <a href="/entreprises?category=Travaux publics" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-road text-[#3D5A40]"></i> Travaux publics</a>
                    </div>
                    <div class="space-y-0.5">
                        <a href="/entreprises?category=Architecte d'intérieur" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-sofa text-[#3D5A40]"></i> Architecte d'intérieur</a>
                        <a href="/entreprises?category=Infographie 3D / Maquette" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-3d-cube-sphere text-[#3D5A40]"></i> Infographie 3D / Maquette</a>
                        <a href="/entreprises?category=Installation de piscine" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-swimming text-[#3D5A40]"></i> Installation de piscine</a>
                        <a href="/entreprises?category=Installation domotique" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-smart-home text-[#3D5A40]"></i> Installation domotique</a>
                        <a href="/entreprises?category=Location engin de chantier" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-backhoe text-[#3D5A40]"></i> Location engin de chantier</a>
                        <a href="/entreprises?category=Pose de carrelage" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-grid-pattern text-[#3D5A40]"></i> Pose de carrelage</a>
                        <a href="/entreprises?category=Pose de menuiserie" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-door text-[#3D5A40]"></i> Pose de menuiserie</a>
                        <a href="/entreprises?category=Topographe" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-map-2 text-[#3D5A40]"></i> Topographe</a>
                        <a href="/entreprises?category=Vidéo et photo immobilière" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-camera text-[#3D5A40]"></i> Vidéo & photo immo.</a>
                    </div>
                </div>
                <div class="border-t border-gray-100 mt-4 pt-3 text-right">
                    <a href="/entreprises" class="text-[#3D5A40] text-sm font-bold hover:underline">Voir tout <i class="ti ti-chevron-right"></i></a>
                </div>
            </div>

            {{-- Maalem Mega Dropdown --}}
            <div x-show="activeMenu === 'maalem'" style="display: none;" class="fixed top-[115px] left-1/2 -translate-x-1/2 w-[860px] bg-white border border-gray-200 rounded-xl shadow-2xl p-6 z-[200]">
                <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                    <h3 class="text-base font-bold text-gray-900 flex items-center gap-2"><i class="ti ti-hammer text-[#3D5A40]"></i> Maalems & Artisans</h3>
                    <button @click="activeMenu = 'choices'" class="text-gray-400 hover:text-gray-600 text-sm"><i class="ti ti-arrow-left mr-1"></i> Retour</button>
                </div>
                <div class="grid grid-cols-4 gap-x-6 gap-y-1">
                    <div class="space-y-0.5">
                        <a href="/maalems?category=Plombier" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-droplet text-[#3D5A40]"></i> Plombier</a>
                        <a href="/maalems?category=Électricien" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-bolt text-[#3D5A40]"></i> Électricien</a>
                        <a href="/maalems?category=Menuisier" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-door text-[#3D5A40]"></i> Menuisier</a>
                        <a href="/maalems?category=Peintre" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-paint text-[#3D5A40]"></i> Peintre</a>
                        <a href="/maalems?category=Carreleur" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-grid-pattern text-[#3D5A40]"></i> Carreleur</a>
                        <a href="/maalems?category=Plâtrier" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-square text-[#3D5A40]"></i> Plâtrier</a>
                    </div>
                    <div class="space-y-0.5">
                        <a href="/maalems?category=Étanchéiste" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-droplet-off text-[#3D5A40]"></i> Étanchéiste</a>
                        <a href="/maalems?category=Maçon" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-wall text-[#3D5A40]"></i> Maçon</a>
                        <a href="/maalems?category=Ferronnerie" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-tools text-[#3D5A40]"></i> Ferronnier</a>
                        <a href="/maalems?category=Jardinier / Paysagiste" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-leaf text-[#3D5A40]"></i> Jardinier / Paysagiste</a>
                        <a href="/maalems?category=Climatisation" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-air-conditioning text-[#3D5A40]"></i> Climatisation</a>
                        <a href="/maalems?category=Ascensoriste" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-elevator text-[#3D5A40]"></i> Ascensoriste</a>
                    </div>
                    <div class="space-y-0.5">
                        <a href="/maalems?category=Cuisiniste" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-chef-hat text-[#3D5A40]"></i> Cuisiniste</a>
                        <a href="/maalems?category=Vitrier" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-window text-[#3D5A40]"></i> Vitrier</a>
                        <a href="/maalems?category=Topographe" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-compass text-[#3D5A40]"></i> Topographe</a>
                        <a href="/maalems?category=Nettoyage" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-brush text-[#3D5A40]"></i> Nettoyage</a>
                        <a href="/maalems?category=Domotique" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-smart-home text-[#3D5A40]"></i> Domotique</a>
                        <a href="/maalems?category=Déménagement" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-truck text-[#3D5A40]"></i> Déménagement</a>
                    </div>
                    <div class="space-y-0.5">
                        <a href="/maalems?category=Forage" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-shovel text-[#3D5A40]"></i> Forage</a>
                        <a href="/maalems?category=Piscine" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-swimming text-[#3D5A40]"></i> Piscine</a>
                        <a href="/maalems?category=Aluminium" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-window text-[#3D5A40]"></i> Aluminium</a>
                        <a href="/maalems?category=Faux plafond" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-layout-grid text-[#3D5A40]"></i> Faux plafond</a>
                        <a href="/maalems?category=Revêtement" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-box text-[#3D5A40]"></i> Revêtement</a>
                        <a href="/maalems?category=Rénovation" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D5A40] rounded-lg transition-colors"><i class="ti ti-home-cog text-[#3D5A40]"></i> Rénovation</a>
                    </div>
                </div>
                <div class="border-t border-gray-100 mt-4 pt-3 text-right">
                    <a href="/maalems" class="text-[#3D5A40] text-sm font-bold hover:underline">Voir tout <i class="ti ti-chevron-right"></i></a>
                </div>
            </div>

            <a href="/fournisseurs" class="text-gray-800 text-[13px] font-bold hover:text-[#3D5A40] transition-colors">Matières</a>
            <a href="/blog" class="text-gray-800 text-[13px] font-bold hover:text-[#3D5A40] transition-colors">Blog</a>
            <a href="/simulateur" class="text-gray-800 text-[13px] font-bold hover:text-[#3D5A40] transition-colors">Simulateur</a>
        </div>
    </nav>

    <!-- Mobile Drawer could be added here as needed -->
</header>
