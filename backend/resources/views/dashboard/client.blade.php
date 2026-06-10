@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Header Profile -->
            <div class="bg-[#3D5A40] px-8 py-10 text-white flex items-center gap-6">
                <div class="h-24 w-24 rounded-full bg-white text-[#3D5A40] flex items-center justify-center text-4xl font-bold shadow-lg">
                    {{ substr($user->name, 0, 1) }}
                </div>
                <div>
                    <h1 class="text-3xl font-bold">{{ $user->name }}</h1>
                    <p class="text-green-100 flex items-center gap-2 mt-2">
                        <i class="ti ti-user-check"></i> Espace Client
                    </p>
                </div>
            </div>

            <!-- Content Area -->
            <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Sidebar -->
                <div class="col-span-1 space-y-4">
                    <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Informations</h3>
                        <div class="space-y-3 text-sm text-gray-600">
                            <p class="flex items-center gap-2"><i class="ti ti-mail text-[#3D5A40]"></i> {{ $user->email }}</p>
                            <p class="flex items-center gap-2"><i class="ti ti-phone text-[#3D5A40]"></i> {{ $user->phone ?? 'Non renseigné' }}</p>
                            <p class="flex items-center gap-2"><i class="ti ti-calendar text-[#3D5A40]"></i> Membre depuis {{ $user->created_at->format('M Y') }}</p>
                        </div>
                        <button type="button" onclick="openModal('clientProfileModal')" class="mt-6 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Modifier le profil
                        </button>
                    </div>
                </div>

                <!-- Main dashboard content -->
                <div class="col-span-1 md:col-span-2">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Mon Activité</h2>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div class="p-6 bg-[#A7C4BC]/10 rounded-xl border border-[#A7C4BC]/30">
                            <div class="flex items-center gap-4">
                                <div class="p-3 bg-[#A7C4BC] rounded-lg text-white">
                                    <i class="ti ti-message-circle text-2xl"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 font-medium">Messages</p>
                                    <p class="text-2xl font-bold text-gray-900">0</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-6 bg-[#3D5A40]/10 rounded-xl border border-[#3D5A40]/30">
                            <div class="flex items-center gap-4">
                                <div class="p-3 bg-[#3D5A40] rounded-lg text-white">
                                    <i class="ti ti-calculator text-2xl"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 font-medium">Simulations enregistrées</p>
                                    <p class="text-2xl font-bold text-gray-900">{{ $simulationCount ?? 0 }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                            <div class="flex items-center gap-4">
                                <div class="p-3 bg-yellow-400 rounded-lg text-white">
                                    <i class="ti ti-star text-2xl"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 font-medium">Avis laissés</p>
                                    <p class="text-2xl font-bold text-gray-900">0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-8 border border-gray-200 mb-8">
                        <div class="flex flex-col lg:flex-row justify-between gap-4 items-center mb-6">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-900">Mes simulations</h3>
                                <p class="text-sm text-gray-500">Enregistrez vos calculs et retrouvez-les facilement.</p>
                            </div>
                            <div class="flex flex-wrap gap-3">
                                <a href="/simulateur" class="inline-flex items-center gap-2 px-5 py-3 bg-[#3D5A40] text-white rounded-lg font-medium hover:bg-[#2c412f] transition-colors">
                                    <i class="ti ti-calculator"></i> Nouvelle simulation
                                </a>
                                <a href="/mes-simulations" class="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <i class="ti ti-layout-list"></i> Voir toutes
                                </a>
                            </div>
                        </div>
                        @if(isset($simulations) && $simulations->isNotEmpty())
                            <div class="space-y-4">
                                @foreach($simulations as $simulation)
                                    <a href="{{ route('simulations.show', $simulation->id) }}" class="group block rounded-2xl border border-gray-200 p-4 hover:border-[#3D5A40] hover:bg-[#F7FAF6] transition-colors">
                                        <div class="flex flex-col sm:flex-row sm:justify-between gap-3">
                                            <div>
                                                <p class="text-sm text-gray-500">Projet</p>
                                                <p class="text-lg font-semibold text-gray-900">{{ $simulation->project_type }}</p>
                                            </div>
                                            <div>
                                                <p class="text-sm text-gray-500">Surface</p>
                                                <p class="text-lg font-semibold text-gray-900">{{ number_format($simulation->area, 0, ',', ' ') }} m²</p>
                                            </div>
                                            <div>
                                                <p class="text-sm text-gray-500">Budget</p>
                                                <p class="text-lg font-semibold text-gray-900">{{ number_format($simulation->budget_min, 0, ',', ' ') }} - {{ number_format($simulation->budget_max, 0, ',', ' ') }} MAD</p>
                                            </div>
                                            <div>
                                                <p class="text-sm text-gray-500">Date</p>
                                                <p class="text-lg font-semibold text-gray-900">{{ $simulation->created_at->format('d M Y') }}</p>
                                            </div>
                                        </div>
                                        <div class="mt-4 flex justify-end">
                                            <span class="inline-flex items-center gap-2 rounded-full border border-[#3D5A40] bg-white px-4 py-2 text-sm font-medium text-[#3D5A40] transition-all duration-200 group-hover:bg-[#3D5A40] group-hover:text-white">
                                                <i class="ti ti-eye"></i> Voir détails
                                            </span>
                                        </div>
                                    </a>
                                @endforeach
                            </div>
                        @else
                            <div class="text-center py-12 text-gray-500">
                                <i class="ti ti-ghost text-4xl mb-4"></i>
                                <p class="text-base font-medium text-gray-900">Aucune simulation enregistrée pour le moment.</p>
                                <p class="mt-2 text-sm">Faites votre première simulation et retrouvez-la ici.</p>
                            </div>
                        @endif
                    </div>

                    <div class="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <i class="ti ti-ghost text-2xl text-gray-400"></i>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune activité récente</h3>
                        <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
                            Commencez à contacter des professionnels ou à utiliser notre simulateur pour voir vos activités ici.
                        </p>
                        <a href="/entreprises" class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3D5A40] text-white rounded-lg font-medium hover:bg-[#2c412f] transition-colors">
                            <i class="ti ti-search"></i> Trouver un pro
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{{-- Profile edit modal for client dashboard --}}
<div id="clientProfileModal" class="fixed inset-0 z-50 hidden">
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="closeModal('clientProfileModal')"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" onclick="event.stopPropagation()">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <i class="ti ti-user-edit text-[#3D5A40]"></i> Modifier le profil
                </h2>
                <button onclick="closeModal('clientProfileModal')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <i class="ti ti-x text-gray-500 text-xl"></i>
                </button>
            </div>
            <form action="{{ route('profile.update') }}" method="POST" class="p-6 space-y-6">
                @csrf
                @method('PUT')

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="client_name" class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                        <input type="text" id="client_name" name="name" value="{{ $user->name }}" required
                               class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                    </div>
                    <div>
                        <label for="client_email" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input type="email" id="client_email" name="email" value="{{ $user->email }}" required
                               class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                    </div>
                    <div>
                        <label for="client_phone" class="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                        <input type="text" id="client_phone" name="phone" value="{{ $user->phone }}"
                               class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                    </div>
                    <div>
                        <label for="client_city" class="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
                        <input type="text" id="client_city" name="city" value="{{ $user->city }}"
                               class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3D5A40] focus:border-[#3D5A40] outline-none transition-shadow">
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <button type="button" onclick="closeModal('clientProfileModal')" class="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" class="px-5 py-2.5 bg-[#3D5A40] text-white rounded-lg text-sm font-medium hover:bg-[#2c412f] transition-colors">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function openModal(id) {
        document.getElementById(id).classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(id) {
        document.getElementById(id).classList.add('hidden');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('clientProfileModal');
            if (modal && !modal.classList.contains('hidden')) {
                closeModal('clientProfileModal');
            }
        }
    });
</script>@endsection
