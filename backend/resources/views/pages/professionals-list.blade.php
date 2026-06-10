@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 capitalize">
                {{ $type === 'entreprise' ? 'Entreprises & Agences' : ($type === 'maalem' ? 'Maalems & Artisans' : 'Fournisseurs & Matériaux') }}
            </h1>
            <p class="mt-2 text-gray-600">Trouvez les meilleurs professionnels pour votre projet de construction ou de rénovation au Maroc.</p>

            @if(in_array($type, ['entreprise', 'maalem']))
                @php $currentFilters = request()->only(['search', 'category']); @endphp
                <div class="mt-6 inline-flex rounded-full bg-gray-100 p-1">
                    <a href="{{ route('entreprises', $currentFilters) }}" class="px-4 py-2 rounded-full text-sm font-semibold transition-colors {{ $type === 'entreprise' ? 'bg-[#3D5A40] text-white' : 'text-gray-700 hover:bg-white hover:text-[#3D5A40]' }}">
                        Entreprises
                    </a>
                    <a href="{{ route('maalems', $currentFilters) }}" class="px-4 py-2 rounded-full text-sm font-semibold transition-colors {{ $type === 'maalem' ? 'bg-[#3D5A40] text-white' : 'text-gray-700 hover:bg-white hover:text-[#3D5A40]' }}">
                        Maalems
                    </a>
                </div>
            @endif
        </div>

        @if($type === 'fournisseur')
            @php
                $materialCategories = [
                    'Aluminium', 'Aménagement extérieur', 'Ascenseurs', 'Automatisme', 'Bâtiment modulaire',
                    'Cache rideau', 'Carrelage', 'Climatisation/chauffage', 'Cuisine', 'EPI', 'Etanchéité',
                    'Ferronnerie / Métallurgie', 'Incendie', 'Isolation', 'Luminaire', 'Matériaux de construction',
                    'Matériel de chantier', 'Matériel électrique', 'Menuiserie', 'Peinture', 'Pierre naturelle',
                    'Piscine', 'Plâtre', 'Plomberie', 'Quincaillerie', 'Revêtement mur', 'Revêtement sol',
                    'Rideaux magasins', 'Salle de bain/sanitaire', 'Système audio', 'Système de surveillance',
                    'Vitrerie', 'Aménagement terrasse'
                ];
                $selectedCategory = request('category');
            @endphp

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                <div class="flex flex-wrap gap-2">
                    @foreach($materialCategories as $category)
                        <a href="{{ route('fournisseurs', ['category' => $category]) }}" class="inline-flex items-center px-3 py-2 rounded-full border text-sm font-medium transition-colors {{ $selectedCategory === $category ? 'bg-[#3D5A40] text-white border-[#3D5A40]' : 'bg-white text-gray-700 border-gray-200 hover:bg-[#E6F1E9] hover:text-[#2f4a31]' }}">
                            {{ $category }}
                        </a>
                    @endforeach
                    <a href="{{ route('fournisseurs') }}" class="inline-flex items-center px-3 py-2 rounded-full border text-sm font-medium text-gray-700 bg-white border-gray-200 hover:bg-[#E6F1E9] hover:text-[#2f4a31]">
                        Tout afficher
                    </a>
                </div>
            </div>
        @endif

        <!-- Filters / Search -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
            <form action="{{ url()->current() }}" method="GET" class="flex-1 flex gap-4">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Rechercher par nom..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D5A40] focus:border-transparent">
                <input type="text" name="category" value="{{ request('category') }}" placeholder="Catégorie (ex: Plomberie)" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D5A40] focus:border-transparent">
                <button type="submit" class="px-6 py-2 bg-[#3D5A40] text-white font-medium rounded-lg hover:bg-[#2c412f] transition-colors shadow-sm">
                    Rechercher
                </button>
            </form>
        </div>

        <!-- Results -->
        @if($type === 'fournisseur')
            <div class="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 class="text-lg font-semibold text-gray-900">Fournisseurs de matières</h2>
                    <p class="text-sm text-gray-500">Choisissez un fournisseur parmi les résultats filtrés.</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-white">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fournisseur</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Catégorie matière</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ville</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vérifié</th>
                                <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @forelse($professionals as $pro)
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $pro->name }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $pro->professionalProfile->category ?? 'N/A' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $pro->city ?? 'Maroc' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        @if($pro->professionalProfile && $pro->professionalProfile->is_verified)
                                            Oui
                                        @else
                                            Non
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="{{ route('pro.show', $pro->id) }}" class="text-[#3D5A40] hover:text-[#1f3424]">Voir profil</a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-gray-500">Aucun fournisseur trouvé pour cette matière.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        @else
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                @forelse($professionals as $pro)
                    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col">
                        <div class="h-32 bg-gray-200 relative">
                            @if($pro->professionalProfile && $pro->professionalProfile->banner_photo)
                                <img src="{{ $pro->professionalProfile->banner_photo }}" alt="Banner" class="w-full h-full object-cover">
                            @else
                                <div class="w-full h-full bg-[#A7C4BC] opacity-50"></div>
                            @endif
                            
                            <div class="absolute -bottom-8 left-4">
                                <div class="w-16 h-16 rounded-full bg-white p-1 shadow-md">
                                    @if($pro->professionalProfile && $pro->professionalProfile->profile_photo)
                                        <img src="{{ $pro->professionalProfile->profile_photo }}" alt="Logo" class="w-full h-full object-cover rounded-full">
                                    @else
                                        <div class="w-full h-full bg-[#3D5A40] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {{ substr($pro->name, 0, 1) }}
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                        
                        <div class="pt-10 p-5 flex-1 flex flex-col">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-lg font-bold text-gray-900 leading-tight">
                                    {{ $pro->name }}
                                    @if($pro->professionalProfile && $pro->professionalProfile->is_verified)
                                        <i class="ti ti-discount-check-filled text-blue-400 text-sm ml-1" title="Vérifié"></i>
                                    @endif
                                </h3>
                            </div>
                            
                            @if($pro->professionalProfile && $pro->professionalProfile->category)
                                <span class="inline-block px-2.5 py-1 bg-green-50 text-[#3D5A40] text-xs font-semibold rounded-full mb-3 w-fit">
                                    {{ $pro->professionalProfile->category }}
                                </span>
                            @endif

                            <div class="text-sm text-gray-500 space-y-1 mb-4 flex-1">
                                <p class="flex items-center gap-1.5"><i class="ti ti-map-pin"></i> {{ $pro->city ?? 'Maroc' }}</p>
                                @if($pro->professionalProfile && $pro->professionalProfile->experience)
                                    <p class="flex items-center gap-1.5"><i class="ti ti-briefcase"></i> Exp: {{ $pro->professionalProfile->experience }}</p>
                                @endif
                            </div>

                            <a href="{{ route('pro.show', $pro->id) }}" class="block w-full text-center px-4 py-2 bg-gray-50 text-[#3D5A40] border border-gray-200 rounded-lg font-medium hover:bg-[#3D5A40] hover:text-white hover:border-[#3D5A40] transition-colors">
                                Voir le profil
                            </a>
                        </div>
                    </div>
                @empty
                    <div class="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <i class="ti ti-search text-4xl text-gray-400 mb-2"></i>
                        <h3 class="text-lg font-medium text-gray-900">Aucun résultat</h3>
                        <p class="text-gray-500 mt-1">Nous n'avons trouvé aucun professionnel correspondant à votre recherche.</p>
                    </div>
                @endforelse
            </div>
        @endif

        <div class="mt-8">
            {{ $professionals->links() }}
        </div>

    </div>
</div>
@endsection
