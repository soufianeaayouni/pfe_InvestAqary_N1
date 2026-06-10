@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen pb-12 font-sans">
    <!-- Banner Section -->
    <div class="w-full h-[250px] md:h-[350px] bg-gray-200 relative">
        @if($professional->professionalProfile && $professional->professionalProfile->banner_photo)
            <img src="{{ $professional->professionalProfile->banner_photo }}" alt="Banner" class="w-full h-full object-cover">
        @else
            <div class="w-full h-full bg-gradient-to-r from-[#3D5A40] to-[#A7C4BC]"></div>
        @endif
        
        <div class="absolute inset-0 bg-black/20"></div>
    </div>

    <!-- Profile Info Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
            <div class="flex flex-col md:flex-row gap-8 items-start">
                
                <!-- Logo -->
                <div class="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white border-4 border-white shadow-xl -mt-20 md:-mt-24 flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                    @if($professional->professionalProfile && $professional->professionalProfile->profile_photo)
                        <img src="{{ $professional->professionalProfile->profile_photo }}" alt="Logo" class="w-full h-full object-cover">
                    @else
                        <span class="text-6xl text-[#3D5A40] font-bold">{{ substr($professional->name, 0, 1) }}</span>
                    @endif
                </div>

                <!-- Info -->
                <div class="flex-1 w-full">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-black text-gray-900 flex items-center gap-2">
                                {{ $professional->name }}
                                @if($professional->professionalProfile && $professional->professionalProfile->is_verified)
                                    <i class="ti ti-discount-check-filled text-blue-500 text-2xl" title="Profil vérifié"></i>
                                @endif
                            </h1>
                            <div class="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-gray-600 font-medium">
                                <span class="flex items-center gap-1.5"><i class="ti ti-map-pin text-[#3D5A40]"></i> {{ $professional->city ?? 'Maroc' }}</span>
                                @if($professional->professionalProfile && $professional->professionalProfile->category)
                                    <span class="flex items-center gap-1.5"><i class="ti ti-tag text-[#3D5A40]"></i> {{ $professional->professionalProfile->category }}</span>
                                @endif
                                <span class="flex items-center gap-1.5 text-yellow-500"><i class="ti ti-star-filled"></i> 4.8 (12 avis)</span>
                            </div>
                        </div>
                        
                        <div class="flex gap-3 w-full md:w-auto">
                            <a href="{{ route('contact.form', $professional->id) }}" class="flex-1 md:flex-none px-6 py-3 bg-[#3D5A40] text-white font-bold rounded-lg hover:bg-[#2c412f] transition-all shadow-md inline-flex items-center justify-center">
                                <i class="ti ti-mail mr-1"></i> Contacter
                            </a>
                            <button class="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all shadow-sm">
                                <i class="ti ti-heart"></i>
                            </button>
                        </div>
                    </div>

                    <div class="mt-8 pt-8 border-t border-gray-100">
                        <h3 class="text-xl font-bold text-gray-900 mb-4">À propos</h3>
                        <p class="text-gray-600 leading-relaxed">
                            {{ $professional->professionalProfile->description ?? 'Ce professionnel n\'a pas encore ajouté de description à son profil.' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Details Grid -->
        <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="col-span-1 space-y-8">
                <!-- Contact Info Card -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Informations de contact</h3>
                    <ul class="space-y-4">
                        <li class="flex items-start gap-3">
                            <div class="w-10 h-10 rounded-full bg-green-50 text-[#3D5A40] flex items-center justify-center flex-shrink-0">
                                <i class="ti ti-phone text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 font-medium">Téléphone</p>
                                <p class="text-gray-900 font-medium">{{ $professional->phone ?? 'Non spécifié' }}</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="w-10 h-10 rounded-full bg-green-50 text-[#3D5A40] flex items-center justify-center flex-shrink-0">
                                <i class="ti ti-mail text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 font-medium">Email</p>
                                <p class="text-gray-900 font-medium">{{ $professional->email }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="col-span-1 lg:col-span-2 space-y-8">
                <!-- Projects Section -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Réalisations & Projets</h3>
                    @if($professional->projects->count() > 0)
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            @foreach($professional->projects as $project)
                                <a href="{{ route('projects.show', $project->slug) }}" class="group block rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
                                    <div class="bg-gray-100 h-48 overflow-hidden">
                                        @if($project->image)
                                            <img src="{{ $project->image }}" alt="{{ $project->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                        @else
                                            <div class="w-full h-full flex items-center justify-center text-gray-400">
                                                <i class="ti ti-photo text-4xl"></i>
                                            </div>
                                        @endif
                                    </div>
                                    <div class="p-4">
                                        <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ $project->title }}</h4>
                                        @if($project->description)
                                            <p class="text-sm text-gray-600 line-clamp-3">{{ $project->description }}</p>
                                        @else
                                            <p class="text-sm text-gray-500">Aucune description fournie.</p>
                                        @endif
                                        <div class="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                                            @if($project->category)
                                                <span class="px-2 py-1 rounded-full bg-gray-100">{{ $project->category }}</span>
                                            @endif
                                            @if($project->location)
                                                <span class="px-2 py-1 rounded-full bg-gray-100">{{ $project->location }}</span>
                                            @endif
                                        </div>
                                    </div>
                                </a>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <i class="ti ti-photo text-4xl text-gray-400 mb-2"></i>
                            <p class="text-gray-500 font-medium">Aucun projet publié pour le moment.</p>
                        </div>
                    @endif
                </div>

                <!-- Reviews Section -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Avis des clients</h3>
                    <div class="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <i class="ti ti-message-star text-4xl text-gray-400 mb-2"></i>
                        <p class="text-gray-500 font-medium">Soyez le premier à laisser un avis pour ce professionnel.</p>
                        <button class="mt-4 px-4 py-2 border border-[#3D5A40] text-[#3D5A40] rounded-lg font-medium hover:bg-green-50 transition-colors">
                            Laisser un avis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
