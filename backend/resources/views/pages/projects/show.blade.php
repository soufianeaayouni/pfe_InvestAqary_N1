@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen pb-24 font-sans">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <a href="{{ route('pro.show', $project->user->id) }}" class="inline-flex items-center gap-2 text-sm font-bold text-[#3D5A40] hover:text-[#2c412f] transition-colors mb-6 group">
            <i class="ti ti-arrow-narrow-left group-hover:-translate-x-1 transition-transform"></i> Retour au profil de {{ $project->user->name }}
        </a>

        <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div class="space-y-6">
                <div class="rounded-3xl overflow-hidden shadow-lg bg-white">
                    @if($project->image)
                        <img src="{{ $project->image }}" alt="{{ $project->title }}" class="w-full h-96 object-cover">
                    @else
                        <div class="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400">
                            <i class="ti ti-photo text-6xl"></i>
                        </div>
                    @endif
                </div>

                <div class="bg-white rounded-3xl border border-gray-150 shadow-sm p-6">
                    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 class="text-3xl font-black text-gray-900">{{ $project->title }}</h1>
                            <p class="text-sm text-gray-500 mt-2">Projet de {{ $project->user->name }} | {{ $project->location ?? 'Localisation non définie' }}</p>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            @if($project->category)
                                <span class="px-3 py-2 rounded-full bg-green-50 text-[#3D5A40] font-semibold text-sm">{{ $project->category }}</span>
                            @endif
                            @if($project->location)
                                <span class="px-3 py-2 rounded-full bg-gray-100 text-gray-600 text-sm">{{ $project->location }}</span>
                            @endif
                        </div>
                    </div>

                    <div class="mt-6 text-gray-700 space-y-4 leading-relaxed text-sm sm:text-base">
                        @if($project->description)
                            <p>{{ $project->description }}</p>
                        @else
                            <p class="text-gray-500">Aucune description n'a été fournie pour ce projet.</p>
                        @endif
                    </div>
                </div>
            </div>

            <aside class="space-y-6">
                <div class="bg-white rounded-3xl border border-gray-150 shadow-sm p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">À propos du professionnel</h2>
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-full bg-green-50 text-[#3D5A40] flex items-center justify-center font-black text-xl">{{ strtoupper(substr($project->user->name, 0, 1)) }}</div>
                            <div>
                                <p class="font-semibold text-gray-900">{{ $project->user->name }}</p>
                                <p class="text-sm text-gray-500">{{ $project->user->professionalProfile->job_title ?? 'Professionnel' }}</p>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm text-gray-600">
                            <div class="flex items-center gap-2">
                                <i class="ti ti-phone-call text-gray-400"></i>
                                <span>{{ $project->user->phone ?? 'Téléphone non renseigné' }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="ti ti-mail text-gray-400"></i>
                                <span>{{ $project->user->email }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-3xl border border-gray-150 shadow-sm p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Informations projet</h2>
                    <ul class="space-y-3 text-sm text-gray-600">
                        <li class="flex items-center justify-between border-b border-gray-100 pb-3">
                            <span class="font-medium text-gray-900">Statut</span>
                            <span class="text-gray-500">{{ ucfirst($project->status) }}</span>
                        </li>
                        <li class="flex items-center justify-between border-b border-gray-100 pb-3">
                            <span class="font-medium text-gray-900">Catégorie</span>
                            <span class="text-gray-500">{{ $project->category ?? 'Non définie' }}</span>
                        </li>
                        <li class="flex items-center justify-between">
                            <span class="font-medium text-gray-900">Ville</span>
                            <span class="text-gray-500">{{ $project->location ?? 'Non renseignée' }}</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
</div>
@endsection
