@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {{-- Flash Messages --}}
        @if(session('success'))
        <div class="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg" id="flash-success">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="ti ti-circle-check text-green-500 text-xl mr-3"></i>
                    <p class="text-sm text-green-700 font-medium">{{ session('success') }}</p>
                </div>
                <button onclick="document.getElementById('flash-success').remove()" class="text-green-500 hover:text-green-700">
                    <i class="ti ti-x"></i>
                </button>
            </div>
        </div>
        @endif

        @if($errors->any())
        <div class="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div class="flex items-start">
                <i class="ti ti-alert-circle text-red-500 text-xl mr-3 mt-0.5"></i>
                <div>
                    <p class="text-sm text-red-700 font-medium mb-1">Erreur(s) détectée(s) :</p>
                    <ul class="list-disc pl-5 text-sm text-red-600">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        @endif

        @if($user->status === 'pending')
        <div class="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="ti ti-alert-triangle text-yellow-400 text-xl"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-yellow-700 font-medium">
                        Votre compte est en attente de validation par un administrateur. Certaines fonctionnalités peuvent être limitées.
                    </p>
                </div>
            </div>
        </div>
        @endif

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Header Profile -->
            <div class="bg-gray-900 px-8 py-10 text-white flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <div class="h-24 w-24 rounded-full bg-[#3D5A40] border-4 border-white flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden">
                        @if($profile && $profile->profile_photo)
                            <img src="{{ $profile->profile_photo }}" alt="Logo" class="w-full h-full object-cover">
                        @else
                            {{ substr($user->name, 0, 1) }}
                        @endif
                    </div>
                    <div>
                        <h1 class="text-3xl font-bold flex items-center gap-2">
                            {{ $user->name }}
                            @if($profile && $profile->is_verified)
                                <i class="ti ti-discount-check-filled text-blue-400" title="Compte vérifié"></i>
                            @endif
                        </h1>
                        <p class="text-gray-400 flex items-center gap-2 mt-2">
                            <i class="ti ti-briefcase"></i> 
                            {{ $profile ? ucfirst($profile->type) . ' - ' . $profile->category : 'Professionnel' }}
                        </p>
                    </div>
                </div>
                <div class="hidden md:block">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium {{ $user->status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                        <span class="w-2 h-2 rounded-full {{ $user->status === 'active' ? 'bg-green-500' : 'bg-yellow-500' }}"></span>
                        {{ $user->status === 'active' ? 'Actif' : 'En attente' }}
                    </span>
                </div>
            </div>

            <!-- Content Area -->
            <div class="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <div class="col-span-1 space-y-4">
                    <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Détails de l'entreprise</h3>
                        <div class="space-y-3 text-sm text-gray-600">
                            <p class="flex items-center gap-2"><i class="ti ti-map-pin text-[#3D5A40]"></i> {{ $user->city ?? 'Non renseigné' }}</p>
                            <p class="flex items-center gap-2"><i class="ti ti-mail text-[#3D5A40]"></i> {{ $user->email }}</p>
                            <p class="flex items-center gap-2"><i class="ti ti-phone text-[#3D5A40]"></i> {{ $user->phone ?? 'Non renseigné' }}</p>
                            @if($profile && $profile->ice)
                                <p class="flex items-center gap-2"><i class="ti ti-file-barcode text-[#3D5A40]"></i> ICE: {{ $profile->ice }}</p>
                            @endif
                            @if($profile && $profile->experience)
                                <p class="flex items-center gap-2"><i class="ti ti-clock text-[#3D5A40]"></i> {{ $profile->experience }} d'expérience</p>
                            @endif
                        </div>
                        @if($profile && $profile->description)
                            <div class="mt-4 pt-4 border-t border-gray-200">
                                <p class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Description</p>
                                <p class="text-sm text-gray-600 leading-relaxed">{{ Str::limit($profile->description, 150) }}</p>
                            </div>
                        @endif
                        <button onclick="openModal('profileModal')" class="mt-6 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#3D5A40] hover:text-[#3D5A40] transition-all duration-200 flex items-center justify-center gap-2">
                            <i class="ti ti-edit"></i> Modifier le profil
                        </button>
                    </div>
                </div>

                <!-- Main dashboard content -->
                <div class="col-span-1 lg:col-span-3">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div class="p-4 bg-blue-50 rounded-lg text-blue-600">
                                <i class="ti ti-eye text-2xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 font-medium">Vues du profil</p>
                                <p class="text-2xl font-bold text-gray-900">{{ $profile->profile_views ?? 0 }}</p>
                            </div>
                        </div>
                        <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div class="p-4 bg-green-50 rounded-lg text-green-600">
                                <i class="ti ti-heart text-2xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 font-medium">Likes reçus</p>
                                <p class="text-2xl font-bold text-gray-900">{{ $user->likesReceived->count() ?? 0 }}</p>
                            </div>
                        </div>
                        <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div class="p-4 bg-yellow-50 rounded-lg text-yellow-600">
                                <i class="ti ti-star text-2xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 font-medium">Note moyenne</p>
                                <p class="text-2xl font-bold text-gray-900">- / 5</p>
                            </div>
                        </div>
                    </div>

                    <!-- Messages Section -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 class="text-lg font-bold text-gray-900">Messages reçus</h3>
                                <p class="text-sm text-gray-500">Vos conversations avec les clients.</p>
                            </div>
                        </div>
                        <div class="p-6">
                            @if(isset($conversations) && $conversations->count() > 0)
                                <div class="space-y-4">
                                    @foreach($conversations as $conversation)
                                        @php
                                            $other = $conversation->sender_id === $user->id ? $conversation->receiver : $conversation->sender;
                                            $message = $conversation->messages->first();
                                        @endphp
                                        <a href="{{ route('messages.show', $conversation->id) }}" class="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                            <div class="flex items-start justify-between gap-3">
                                                <div>
                                                    <p class="text-sm text-gray-500">Conversation avec</p>
                                                    <h4 class="text-base font-semibold text-gray-900">{{ $other->name }}</h4>
                                                </div>
                                                @if($conversation->unread_count > 0)
                                                    <span class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-[#3D5A40] text-white">
                                                        {{ $conversation->unread_count }} non lu{{ $conversation->unread_count > 1 ? 's' : '' }}
                                                    </span>
                                                @endif
                                            </div>
                                            @if($message)
                                                <p class="mt-3 text-sm text-gray-600 line-clamp-2">{{ \Illuminate\Support\Str::limit($message->body, 120) }}</p>
                                                <p class="mt-2 text-xs text-gray-400">Dernier message : {{ $message->created_at->format('d M Y H:i') }}</p>
                                            @else
                                                <p class="mt-3 text-sm text-gray-600">Aucun message dans cette conversation pour le moment.</p>
                                            @endif
                                        </a>
                                    @endforeach
                                </div>
                            @else
                                <div class="text-center py-10 text-gray-500">
                                    <i class="ti ti-message-circle text-4xl mb-3"></i>
                                    <p>Vous n'avez pas encore de messages.</p>
                                    <p class="text-sm mt-2">Les clients qui vous contactent apparaîtront ici.</p>
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Projects Section -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 class="text-lg font-bold text-gray-900">Mes Projets</h3>
                            <button onclick="openModal('projectModal')" class="px-4 py-2 bg-[#3D5A40] text-white rounded-lg text-sm font-medium hover:bg-[#2c412f] transition-colors flex items-center gap-1.5">
                                <i class="ti ti-plus"></i> Ajouter
                            </button>
                        </div>

                        @if($projects->count() > 0)
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            @foreach($projects as $project)
                            <div class="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div class="relative aspect-video bg-gray-100 overflow-hidden">
                                    @if($project->image)
                                        <img src="{{ $project->image }}" alt="{{ $project->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                    @else
                                        <div class="w-full h-full flex items-center justify-center text-gray-300">
                                            <i class="ti ti-photo text-4xl"></i>
                                        </div>
                                    @endif
                                    <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <form id="delete-form-{{ $project->id }}" action="{{ route('pro.projects.destroy', $project->id) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <button type="button" onclick="if(confirm('Supprimer ce projet ?')) document.getElementById('delete-form-{{ $project->id }}').submit();" class="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg" title="Supprimer">
                                                <i class="ti ti-trash text-sm"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div class="p-4">
                                    <h4 class="font-semibold text-gray-900 text-sm truncate">{{ $project->title }}</h4>
                                    @if($project->description)
                                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ Str::limit($project->description, 80) }}</p>
                                    @endif
                                    <div class="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                        @if($project->category)
                                            <span class="flex items-center gap-1"><i class="ti ti-tag"></i> {{ $project->category }}</span>
                                        @endif
                                        @if($project->location)
                                            <span class="flex items-center gap-1"><i class="ti ti-map-pin"></i> {{ $project->location }}</span>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                        @else
                        <div class="p-8 text-center text-gray-500">
                            <i class="ti ti-photo-off text-4xl mb-2 text-gray-300"></i>
                            <p>Vous n'avez pas encore ajouté de projets.</p>
                            <p class="text-sm mt-1">Ajoutez des photos de vos réalisations pour attirer plus de clients.</p>
                        </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- ==================== MODAL: Modifier le profil ==================== --}}
<div id="profileModal" class="fixed inset-0 z-50 hidden">
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="closeModal('profileModal')"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" onclick="event.stopPropagation()">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <i class="ti ti-user-edit text-[#3D5A40]"></i> Modifier le profil
                </h2>
                <button onclick="closeModal('profileModal')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <i class="ti ti-x text-gray-500 text-xl"></i>
                </button>
            </div>

            <!-- Modal Form -->
            <form action="{{ route('profile.update') }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <div class="p-6 space-y-6">

                    {{-- Photo de profil --}}
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Photo de profil / Logo</label>
                        <div class="flex items-center gap-4">
                            <div class="h-16 w-16 rounded-full bg-[#3D5A40] flex items-center justify-center text-2xl font-bold text-white overflow-hidden border-2 border-gray-200">
                                @if($profile && $profile->profile_photo)
                                    <img src="{{ $profile->profile_photo }}" alt="Photo" class="w-full h-full object-cover" id="profilePhotoPreview">
                                @else
                                    <span id="profilePhotoPreview">{{ substr($user->name, 0, 1) }}</span>
                                @endif
                            </div>
                            <div>
                                <input type="file" name="profile_photo" id="profile_photo_input" accept="image/*" class="hidden" onchange="previewImage(this, 'profilePhotoPreview')">
                                <button type="button" onclick="document.getElementById('profile_photo_input').click()" class="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                    Changer la photo
                                </button>
                                <p class="text-xs text-gray-400 mt-1">JPG, PNG — 5 Mo max</p>
                            </div>
                        </div>
                    </div>

                    {{-- Type de professionnel --}}
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Type de professionnel</label>
                        <div class="grid grid-cols-3 gap-3">
                            <label class="relative flex cursor-pointer rounded-lg border p-3 hover:border-[#3D5A40] transition-colors {{ ($profile && $profile->type === 'entreprise') ? 'border-[#3D5A40] bg-green-50' : 'border-gray-200 bg-white' }}">
                                <input type="radio" name="type" value="entreprise" class="sr-only" {{ ($profile && $profile->type === 'entreprise') ? 'checked' : '' }}>
                                <span class="text-sm font-medium text-gray-900">Entreprise</span>
                            </label>
                            <label class="relative flex cursor-pointer rounded-lg border p-3 hover:border-[#3D5A40] transition-colors {{ ($profile && $profile->type === 'maalem') ? 'border-[#3D5A40] bg-green-50' : 'border-gray-200 bg-white' }}">
                                <input type="radio" name="type" value="maalem" class="sr-only" {{ ($profile && $profile->type === 'maalem') ? 'checked' : '' }}>
                                <span class="text-sm font-medium text-gray-900">Maalem</span>
                            </label>
                            <label class="relative flex cursor-pointer rounded-lg border p-3 hover:border-[#3D5A40] transition-colors {{ ($profile && $profile->type === 'fournisseur') ? 'border-[#3D5A40] bg-green-50' : 'border-gray-200 bg-white' }}">
                                <input type="radio" name="type" value="fournisseur" class="sr-only" {{ ($profile && $profile->type === 'fournisseur') ? 'checked' : '' }}>
                                <span class="text-sm font-medium text-gray-900">Fournisseur</span>
                            </label>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {{-- Nom de l'entreprise --}}
                        <div>
                            <label for="edit_company_name" class="block text-sm font-semibold text-gray-700 mb-1">Nom de l'entreprise</label>
                            <input type="text" id="edit_company_name" name="company_name" value="{{ $profile->company_name ?? $user->name }}"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>

                        {{-- Aussi name (hidden, sync avec company_name) --}}
                        <input type="hidden" name="name" id="edit_name_hidden" value="{{ $user->name }}">

                        {{-- Email --}}
                        <div>
                            <label for="edit_email" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input type="email" id="edit_email" name="email" value="{{ $user->email }}"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>

                        {{-- Téléphone --}}
                        <div>
                            <label for="edit_phone" class="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                            <input type="text" id="edit_phone" name="phone" value="{{ $user->phone }}"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>

                        {{-- Ville --}}
                        <div>
                            <label for="edit_city" class="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
                            <input type="text" id="edit_city" name="city" value="{{ $user->city }}"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>

                        {{-- Catégorie --}}
                        <div>
                            <label for="edit_category" class="block text-sm font-semibold text-gray-700 mb-1">Catégorie / Domaine</label>
                            <input type="text" id="edit_category" name="category" value="{{ $profile->category ?? '' }}" placeholder="Ex: Construction, Plomberie..."
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>

                        {{-- ICE --}}
                        <div>
                            <label for="edit_ice" class="block text-sm font-semibold text-gray-700 mb-1">ICE</label>
                            <input type="text" id="edit_ice" name="ice" value="{{ $profile->ice ?? '' }}" placeholder="Identifiant Commun de l'Entreprise"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>
                    </div>

                    {{-- Expérience --}}
                    <div>
                        <label for="edit_experience" class="block text-sm font-semibold text-gray-700 mb-1">Années d'expérience</label>
                        <input type="text" id="edit_experience" name="experience" value="{{ $profile->experience ?? '' }}" placeholder="Ex: 5 ans, 10+ ans..."
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                    </div>

                    {{-- Description --}}
                    <div>
                        <label for="edit_description" class="block text-sm font-semibold text-gray-700 mb-1">Description de vos services</label>
                        <textarea id="edit_description" name="description" rows="4" placeholder="Décrivez votre activité, vos services et vos compétences..."
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow resize-none">{{ $profile->description ?? '' }}</textarea>
                    </div>

                    {{-- Banner photo --}}
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Photo de couverture (bannière)</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#3D5A40] transition-colors cursor-pointer" onclick="document.getElementById('banner_photo_input').click()">
                            <input type="file" name="banner_photo" id="banner_photo_input" accept="image/*" class="hidden">
                            <i class="ti ti-cloud-upload text-3xl text-gray-400"></i>
                            <p class="text-sm text-gray-500 mt-1">Cliquez pour télécharger</p>
                            <p class="text-xs text-gray-400">JPG, PNG — 5 Mo max</p>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                    <button type="button" onclick="closeModal('profileModal')" class="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" class="px-5 py-2.5 bg-[#3D5A40] text-white rounded-lg text-sm font-medium hover:bg-[#2c412f] transition-colors flex items-center gap-2">
                        <i class="ti ti-check"></i> Enregistrer les modifications
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- ==================== MODAL: Ajouter un projet ==================== --}}
<div id="projectModal" class="fixed inset-0 z-50 hidden">
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="closeModal('projectModal')"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative" onclick="event.stopPropagation()">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <i class="ti ti-folder-plus text-[#3D5A40]"></i> Ajouter un projet
                </h2>
                <button onclick="closeModal('projectModal')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <i class="ti ti-x text-gray-500 text-xl"></i>
                </button>
            </div>

            <!-- Modal Form -->
            <form action="{{ route('pro.projects.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="p-6 space-y-5">

                    {{-- Titre --}}
                    <div>
                        <label for="project_title" class="block text-sm font-semibold text-gray-700 mb-1">Titre du projet *</label>
                        <input type="text" id="project_title" name="title" required placeholder="Ex: Villa moderne à Marrakech"
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                    </div>

                    {{-- Description --}}
                    <div>
                        <label for="project_description" class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea id="project_description" name="description" rows="3" placeholder="Décrivez le projet réalisé..."
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow resize-none"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        {{-- Catégorie --}}
                        <div>
                            <label for="project_category" class="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
                            <input type="text" id="project_category" name="category" placeholder="Ex: Construction"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>

                        {{-- Ville --}}
                        <div>
                            <label for="project_city" class="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
                            <input type="text" id="project_city" name="city" placeholder="Ex: Casablanca"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                        </div>
                    </div>

                    {{-- Image du projet --}}
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Photo du projet</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#3D5A40] transition-colors cursor-pointer relative" id="projectImageDropzone" onclick="document.getElementById('project_image_input').click()">
                            <input type="file" name="image_file" id="project_image_input" accept="image/*" class="hidden" onchange="previewProjectImage(this)">
                            <div id="projectImagePlaceholder">
                                <i class="ti ti-cloud-upload text-4xl text-gray-400"></i>
                                <p class="text-sm text-gray-500 mt-2">Cliquez pour ajouter une photo</p>
                                <p class="text-xs text-gray-400 mt-1">JPG, PNG, GIF — 5 Mo max</p>
                            </div>
                            <div id="projectImagePreview" class="hidden">
                                <img id="projectImagePreviewImg" src="" alt="Preview" class="max-h-40 mx-auto rounded-lg">
                                <p class="text-xs text-gray-500 mt-2">Cliquez pour changer l'image</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                    <button type="button" onclick="closeModal('projectModal')" class="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" class="px-5 py-2.5 bg-[#3D5A40] text-white rounded-lg text-sm font-medium hover:bg-[#2c412f] transition-colors flex items-center gap-2">
                        <i class="ti ti-plus"></i> Ajouter le projet
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- ==================== JavaScript ==================== --}}
<script>
    // Modal open/close
    function openModal(id) {
        document.getElementById(id).classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(id) {
        document.getElementById(id).classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.fixed.inset-0.z-50:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
            });
            document.body.style.overflow = '';
        }
    });

    // Sync company_name → hidden name field
    const companyInput = document.getElementById('edit_company_name');
    const nameHidden = document.getElementById('edit_name_hidden');
    if (companyInput && nameHidden) {
        companyInput.addEventListener('input', function() {
            nameHidden.value = this.value;
        });
    }

    // Radio button visual toggle for type
    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove all active styles
            this.closest('.grid').querySelectorAll('label').forEach(label => {
                label.classList.remove('border-[#3D5A40]', 'bg-green-50');
                label.classList.add('border-gray-200', 'bg-white');
            });
            // Add active style
            this.closest('label').classList.remove('border-gray-200', 'bg-white');
            this.closest('label').classList.add('border-[#3D5A40]', 'bg-green-50');
        });
    });

    function previewImage(input, previewId) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById(previewId);
                if (!preview) {
                    return;
                }

                if (preview.tagName.toLowerCase() === 'img') {
                    preview.src = e.target.result;
                } else {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="w-full h-full object-cover" />`;
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Project image preview
    function previewProjectImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('projectImagePreviewImg').src = e.target.result;
                document.getElementById('projectImagePlaceholder').classList.add('hidden');
                document.getElementById('projectImagePreview').classList.remove('hidden');
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Auto-open modals if there are validation errors
    @if($errors->any())
        // Check if errors relate to profile or project
        @if($errors->has('company_name') || $errors->has('description') || $errors->has('ice') || $errors->has('profile_photo') || $errors->has('banner_photo') || $errors->has('experience') || $errors->has('category'))
            openModal('profileModal');
        @endif
        @if($errors->has('title') || $errors->has('image_file'))
            openModal('projectModal');
        @endif
    @endif
</script>
@endsection
