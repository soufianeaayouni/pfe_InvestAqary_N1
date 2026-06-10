@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
                <p class="text-gray-500 mt-1">Vue d'ensemble de la plateforme InvestAqary</p>
            </div>
            <div class="flex gap-3">
                <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                    <i class="ti ti-settings"></i> Paramètres
                </button>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Total Utilisateurs</p>
                        <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ $usersCount }}</h3>
                    </div>
                    <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <i class="ti ti-users text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Professionnels</p>
                        <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ $prosCount }}</h3>
                    </div>
                    <div class="p-3 bg-green-50 text-green-600 rounded-lg">
                        <i class="ti ti-briefcase text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Clients</p>
                        <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ $clientsCount }}</h3>
                    </div>
                    <div class="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <i class="ti ti-user-circle text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Projets</p>
                        <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ $projectsCount }}</h3>
                    </div>
                    <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <i class="ti ti-stack text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Produits</p>
                        <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ $productsCount }}</h3>
                    </div>
                    <div class="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
                        <i class="ti ti-package text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Simulations</p>
                        <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ $simulationsCount }}</h3>
                    </div>
                    <div class="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-lg">
                        <i class="ti ti-calculator text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Utilisateurs en attente</p>
                        <h3 class="text-3xl font-bold text-yellow-600 mt-1">{{ $pendingUsersCount }}</h3>
                    </div>
                    <div class="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                        <i class="ti ti-clock-hour-4 text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Pros non vérifiés</p>
                        <h3 class="text-3xl font-bold text-red-600 mt-1">{{ $unverifiedProsCount }}</h3>
                    </div>
                    <div class="p-3 bg-red-50 text-red-600 rounded-lg">
                        <i class="ti ti-shield-off text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pending users approval -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">Utilisateurs en attente</h3>
                <span class="text-sm text-gray-500">{{ $pendingUsersCount }} en attente</span>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nom</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rôle</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse($pendingUsers as $pendingUser)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $pendingUser->name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $pendingUser->email }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($pendingUser->role) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($pendingUser->professionalProfile?->type ?? 'N/A') }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <form action="{{ route('admin.users.status', $pendingUser->id) }}" method="POST" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="active">
                                        <button type="submit" class="px-3 py-1 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Activer</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-gray-500">Aucun utilisateur en attente.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(session('success') || session('error'))
            <div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                @if(session('success'))
                    <div class="text-sm text-green-700">{{ session('success') }}</div>
                @endif
                @if(session('error'))
                    <div class="text-sm text-red-700">{{ session('error') }}</div>
                @endif
            </div>
        @endif

        <!-- Pending users approval -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">Utilisateurs en attente</h3>
                <span class="text-sm text-gray-500">{{ $pendingUsersCount }} en attente</span>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nom</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rôle</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse($pendingUsers as $pendingUser)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $pendingUser->name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $pendingUser->email }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($pendingUser->role) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($pendingUser->professionalProfile?->type ?? 'N/A') }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <form action="{{ route('admin.users.status', $pendingUser->id) }}" method="POST" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="active">
                                        <button type="submit" class="px-3 py-1 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Activer</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-gray-500">Aucun utilisateur en attente.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- All users management -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">Gestion des comptes</h3>
                <span class="text-sm text-gray-500">{{ $allUsers->count() }} comptes</span>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nom</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rôle</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($allUsers as $managedUser)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $managedUser->name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $managedUser->email }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($managedUser->role) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($managedUser->status) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    @if($managedUser->id !== auth()->id())
                                        <form action="{{ route('admin.users.status', $managedUser->id) }}" method="POST" class="inline">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="status" value="{{ $managedUser->status === 'active' ? 'suspended' : 'active' }}">
                                            <button type="submit" class="px-3 py-1 text-white {{ $managedUser->status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700' }} rounded-lg transition-colors">
                                                {{ $managedUser->status === 'active' ? 'Suspendre' : 'Activer' }}
                                            </button>
                                        </form>
                                    @else
                                        <span class="text-sm text-gray-400">Pas autorisé</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick Actions & Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="col-span-1 lg:col-span-2 space-y-8">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 class="text-lg font-bold text-gray-900">Utilisateurs Récents</h3>
                        <a href="#" class="text-sm font-medium text-[#3D5A40] hover:underline">Voir tout</a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nom</th>
                                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rôle</th>
                                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vérifié</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @forelse($recentUsers as $recentUser)
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $recentUser->name }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $recentUser->email }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($recentUser->role) }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ucfirst($recentUser->status ?? 'actif') }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            @if($recentUser->role === 'pro')
                                                {{ $recentUser->professionalProfile?->is_verified ? 'Oui' : 'Non' }}
                                            @else
                                                -
                                            @endif
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">Aucun utilisateur récent.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-span-1 space-y-8">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Gestion</h3>
                    <div class="space-y-2">
                        <a href="#" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <span class="flex items-center gap-3 text-gray-700 font-medium"><i class="ti ti-users text-[#3D5A40]"></i> Utilisateurs</span>
                            <i class="ti ti-chevron-right text-gray-400 group-hover:text-gray-600"></i>
                        </a>
                        <a href="#" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <span class="flex items-center gap-3 text-gray-700 font-medium"><i class="ti ti-building-store text-[#3D5A40]"></i> Projets & Produits</span>
                            <i class="ti ti-chevron-right text-gray-400 group-hover:text-gray-600"></i>
                        </a>
                        <a href="#" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <span class="flex items-center gap-3 text-gray-700 font-medium"><i class="ti ti-calculator text-[#3D5A40]"></i> Simulations</span>
                            <i class="ti ti-chevron-right text-gray-400 group-hover:text-gray-600"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
