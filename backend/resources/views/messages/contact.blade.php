@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div class="bg-[#3D5A40] px-8 py-8 text-white">
                <h1 class="text-3xl font-bold">Contacter {{ $professional->name }}</h1>
                <p class="mt-2 text-gray-200">Envoyez un message directement au professionnel et suivez la conversation depuis votre espace.</p>
            </div>

            <div class="p-8">
                @if(session('success'))
                    <div class="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                        {{ session('success') }}
                    </div>
                @endif

                @if($errors->any())
                    <div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                        <ul class="list-disc list-inside space-y-1">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div class="lg:col-span-1 bg-gray-50 rounded-2xl border border-gray-200 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Professionnel</h2>
                        <p class="text-sm text-gray-500 mb-2">Nom</p>
                        <p class="font-medium text-gray-900 mb-4">{{ $professional->name }}</p>

                        <p class="text-sm text-gray-500 mb-2">Ville</p>
                        <p class="font-medium text-gray-900 mb-4">{{ $professional->city ?? 'Non spécifié' }}</p>

                        <p class="text-sm text-gray-500 mb-2">Catégorie</p>
                        <p class="font-medium text-gray-900">{{ $professional->professionalProfile->category ?? 'Non spécifié' }}</p>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                        <form action="{{ route('contact.send', $professional->id) }}" method="POST">
                            @csrf
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Votre message</label>
                                    <textarea name="body" rows="8" class="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#3D5A40] focus:ring-0" placeholder="Bonjour, je souhaite en savoir plus sur vos services...">{{ old('body') }}</textarea>
                                </div>

                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div class="text-sm text-gray-500">
                                        Ce message sera envoyé directement à {{ $professional->name }}.
                                    </div>
                                    <button type="submit" class="inline-flex items-center gap-2 rounded-2xl bg-[#3D5A40] px-6 py-3 text-white font-semibold hover:bg-[#2c412f] transition-colors">
                                        <i class="ti ti-send"></i> Envoyer le message
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Informations de contact</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <p class="text-sm text-gray-500">Email</p>
                            <p class="font-medium text-gray-900">{{ $professional->email }}</p>
                        </div>
                        <div class="space-y-2">
                            <p class="text-sm text-gray-500">Téléphone</p>
                            <p class="font-medium text-gray-900">{{ $professional->phone ?? 'Non spécifié' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
