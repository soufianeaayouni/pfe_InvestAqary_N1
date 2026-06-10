@extends('layouts.app')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Inscription Professionnel
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Rejoignez le réseau InvestAqary et développez votre activité.
            </p>
        </div>

        @if ($errors->any())
            <div class="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                <ul class="list-disc pl-5">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form class="mt-8 space-y-6" action="/register/pro" method="POST" enctype="multipart/form-data">
            @csrf
            @php $selectedType = old('type', 'entreprise'); @endphp
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Type de compte -->
                <div class="col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type de professionnel</label>
                    <div class="grid grid-cols-2 gap-4">
                        <label class="relative cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#3D5A40]">
                            <input type="radio" name="type" value="entreprise" required class="sr-only peer" {{ $selectedType === 'entreprise' ? 'checked' : '' }}>
                            <div class="flex items-center justify-center min-h-[100px] p-4 rounded-lg transition-all border border-transparent peer-checked:border-[#3D5A40] peer-checked:bg-green-50">
                                <span class="text-sm font-medium text-gray-900">Entreprise / Agence</span>
                            </div>
                        </label>
                        <label class="relative cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#3D5A40]">
                            <input type="radio" name="type" value="maalem" class="sr-only peer" {{ $selectedType === 'maalem' ? 'checked' : '' }}>
                            <div class="flex items-center justify-center min-h-[100px] p-4 rounded-lg transition-all border border-transparent peer-checked:border-[#3D5A40] peer-checked:bg-green-50">
                                <span class="text-sm font-medium text-gray-900">Maalem / Artisan</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Informations générales -->
                <div class="col-span-1 md:col-span-2">
                    <label for="company_name" class="block text-sm font-medium text-gray-700">Nom de l'entreprise ou du professionnel</label>
                    <input id="company_name" name="company_name" type="text" required class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm" value="{{ old('company_name') }}">
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Adresse email professionnelle</label>
                    <input id="email" name="email" type="email" required class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm" value="{{ old('email') }}">
                </div>

                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone professionnel</label>
                    <input id="phone" name="phone" type="text" required class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm" value="{{ old('phone') }}">
                </div>

                <div>
                    <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
                    <input id="city" name="city" type="text" required class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm" value="{{ old('city') }}">
                </div>

                <div>
                    <label for="category" class="block text-sm font-medium text-gray-700">Domaine d'expertise / Catégorie</label>
                    <input id="category" name="category" type="text" placeholder="Ex: Construction, Plomberie..." class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm" value="{{ old('category') }}">
                </div>

                <div class="col-span-1 md:col-span-2">
                    <label for="description" class="block text-sm font-medium text-gray-700">Description de vos services</label>
                    <textarea id="description" name="description" rows="3" class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm">{{ old('description') }}</textarea>
                </div>

                <!-- Mots de passe -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input id="password" name="password" type="password" required class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm">
                </div>

                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <input id="password_confirmation" name="password_confirmation" type="password" required class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3D5A40] focus:border-[#3D5A40] sm:text-sm">
                </div>
            </div>

            <div>
                <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3D5A40] hover:bg-[#2c412f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D5A40] transition-colors shadow-lg">
                    Soumettre ma candidature
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
