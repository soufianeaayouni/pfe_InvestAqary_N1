@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="bg-[#3D5A40] px-8 py-10 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 class="text-3xl font-bold">Mes simulations</h1>
                    <p class="text-green-100 mt-2">Retrouvez toutes vos simulations enregistrées et créez-en de nouvelles.</p>
                </div>
                <div class="flex gap-3 flex-wrap">
                    <a href="/simulateur" class="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#3D5A40] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                        <i class="ti ti-calculator"></i> Nouvelle simulation
                    </a>
                    <a href="/dashboard/client" class="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#3D5A40] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                        <i class="ti ti-layout-dashboard"></i> Retour au dashboard
                    </a>
                </div>
            </div>
        </div>

        @if($simulations->isNotEmpty())
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 class="text-lg font-semibold text-gray-900">Simulations enregistrées</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-white">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Projet</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Surface</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Budget</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ROI</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @foreach($simulations as $simulation)
                                <tr class="hover:bg-[#F7FAF6] transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {{ $simulation->project_type }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ number_format($simulation->area, 0, ',', ' ') }} m²</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ number_format($simulation->budget_min, 0, ',', ' ') }} - {{ number_format($simulation->budget_max, 0, ',', ' ') }} MAD</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ is_numeric(data_get($simulation->raw_data, 'results.roi')) ? number_format(data_get($simulation->raw_data, 'results.roi'), 1, ',', ' ') . '%' : '-' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $simulation->created_at->format('d M Y') }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <a href="{{ route('simulations.show', $simulation->id) }}" class="inline-flex items-center gap-2 rounded-full border border-[#3D5A40] bg-white px-3 py-2 text-sm font-medium text-[#3D5A40] hover:bg-[#3D5A40] hover:text-white transition-colors">
                                            <i class="ti ti-eye"></i> Voir détails
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        @else
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
                <div class="mx-auto mb-6 w-16 h-16 rounded-full bg-[#E8F0EA] flex items-center justify-center text-[#3D5A40]">
                    <i class="ti ti-calculator text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Aucune simulation enregistrée</h3>
                <p class="text-gray-500 mt-2">Utilisez le simulateur pour créer et sauvegarder vos premières simulations.</p>
                <a href="/simulateur" class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#3D5A40] text-white rounded-lg font-medium hover:bg-[#2c412f] transition-colors">
                    <i class="ti ti-calculator"></i> Commencer une simulation
                </a>
            </div>
        @endif
    </div>
</div>
@endsection
