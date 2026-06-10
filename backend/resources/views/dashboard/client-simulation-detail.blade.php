@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10 font-sans">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="bg-[#3D5A40] px-8 py-10 text-white">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold">Détail de la simulation</h1>
                        <p class="text-green-100 mt-2">Affichez toutes les informations enregistrées pour cette simulation.</p>
                    </div>
                    <div class="flex gap-3 flex-wrap">
                        <a href="/mes-simulations" class="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#3D5A40] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            <i class="ti ti-layout-list"></i> Retour aux simulations
                        </a>
                        <a href="/simulateur" class="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#3D5A40] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            <i class="ti ti-calculator"></i> Nouvelle simulation
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Résumé</h2>
                <div class="space-y-4 text-sm text-gray-600">
                    <div>
                        <p class="text-gray-500">Projet</p>
                        <p class="text-lg font-semibold text-gray-900">{{ $simulation->project_type }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Surface</p>
                        <p class="text-lg font-semibold text-gray-900">{{ number_format($simulation->area, 0, ',', ' ') }} m²</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Budget minimal</p>
                        <p class="text-lg font-semibold text-gray-900">{{ number_format($simulation->budget_min, 0, ',', ' ') }} MAD</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Budget maximal</p>
                        <p class="text-lg font-semibold text-gray-900">{{ number_format($simulation->budget_max, 0, ',', ' ') }} MAD</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Enregistrée le</p>
                        <p class="text-lg font-semibold text-gray-900">{{ $simulation->created_at->format('d M Y H:i') }}</p>
                    </div>
                </div>
            </div>
            <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Données détaillées</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="rounded-2xl border border-gray-100 p-4 bg-[#F7FAF6]">
                        <p class="text-sm text-gray-500">Terrain</p>
                        <p class="text-base text-gray-900 mt-2">Superficie: {{ data_get($simulation->raw_data, 'terrain.superficie') !== null ? number_format(data_get($simulation->raw_data, 'terrain.superficie'), 0, ',', ' ') . ' m²' : 'N/A' }}</p>
                        <p class="text-base text-gray-900">Prix: {{ data_get($simulation->raw_data, 'terrain.prix') !== null ? number_format(data_get($simulation->raw_data, 'terrain.prix'), 0, ',', ' ') . ' MAD' : 'N/A' }}</p>
                    </div>
                    <div class="rounded-2xl border border-gray-100 p-4 bg-[#F7FAF6]">
                        <p class="text-sm text-gray-500">Standing</p>
                        <p class="text-base text-gray-900 mt-2">{{ data_get($simulation->raw_data, 'standing') ?? 'N/A' }}</p>
                    </div>
                    <div class="rounded-2xl border border-gray-100 p-4 bg-[#F7FAF6]">
                        <p class="text-sm text-gray-500">ROI</p>
                        <p class="text-base text-gray-900 mt-2">
                            @php
                                $roi = data_get($simulation->raw_data, 'results.roi');
                            @endphp
                            {{ is_numeric($roi) ? number_format($roi, 1, ',', ' ') . '%' : 'N/A' }}
                        </p>
                    </div>
                    <div class="rounded-2xl border border-gray-100 p-4 bg-[#F7FAF6]">
                        <p class="text-sm text-gray-500">Marge brute</p>
                        <p class="text-base text-gray-900 mt-2">
                            @php
                                $marge = data_get($simulation->raw_data, 'results.margeBrute');
                            @endphp
                            {{ is_numeric($marge) ? number_format($marge, 0, ',', ' ') . ' MAD' : 'N/A' }}
                        </p>
                    </div>
                </div>
                <div class="mt-6 bg-gray-50 rounded-2xl border border-gray-100 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Toutes les données</h3>
                    <pre class="text-xs text-gray-700 overflow-x-auto bg-white border border-gray-200 rounded-xl p-4">{{ json_encode($simulation->raw_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) }}</pre>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
