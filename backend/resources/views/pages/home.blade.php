@extends('layouts.app')

@section('content')
<div class="relative overflow-hidden font-sans pt-12 pb-24 md:pt-[100px] md:pb-[140px] px-6 md:px-10 lg:px-16 bg-[#fafafa]">
    <!-- Decorator circles -->
    <div class="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#3D5A40]/5 blur-3xl"></div>
    <div class="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] rounded-full bg-yellow-600/5 blur-3xl"></div>

    <div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[60px] items-center relative z-10">
        <div class="flex flex-col gap-6 md:gap-[30px] max-w-[600px]">
            <h1 class="text-[36px] md:text-[46px] lg:text-[54px] font-black text-gray-900 leading-[1.15] tracking-tight m-0">
                Trouvez les meilleurs professionnels pour vos projets au Maroc.
            </h1>
            <p class="text-[16px] md:text-[18px] text-gray-500 font-medium leading-[1.6] max-w-[500px]">
                InvestAqary vous connecte avec les meilleurs maîtres d'œuvre, fournisseurs et entreprises de construction pour réaliser vos projets immobiliers.
            </p>
            <div class="flex flex-wrap gap-4 mt-2">
                <a href="/entreprises" class="px-8 py-3.5 bg-[#3D5A40] text-white rounded-lg font-bold text-[15px] hover:bg-[#2c412f] transition-all shadow-xl hover:-translate-y-1">
                    Trouver un Pro
                </a>
                <a href="/simulateur" class="px-8 py-3.5 bg-white border-2 border-gray-200 text-gray-800 rounded-lg font-bold text-[15px] hover:border-gray-300 hover:bg-gray-50 transition-all">
                    Estimer le coût
                </a>
            </div>
        </div>

        <div class="relative w-full h-[300px] md:h-[450px] lg:h-[550px] hidden md:block">
            <!-- Illustration / Image placeholder -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#A7C4BC] to-[#3D5A40] rounded-[40px] shadow-2xl flex items-center justify-center text-white text-5xl">
                <i class="ti ti-home-cog"></i>
            </div>
        </div>
    </div>
</div>

<div class="max-w-[1200px] mx-auto grid gap-8 mt-12 px-6 md:px-10 lg:px-16 lg:grid-cols-2">
    <div class="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F1E9] text-[#3D5A40] font-semibold text-sm mb-4">
            <i class="ti ti-hammer"></i>
            Offres Maalems
        </span>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Artisans et Maalems qualifiés</h2>
        <p class="text-gray-600 leading-7 mb-6">Découvrez des profils d’artisans spécialisés, disponibles pour des travaux de menuiserie, électricité, plomberie, peinture et plus encore.</p>
        <div class="space-y-3">
            <div class="rounded-2xl bg-[#F6FBF6] border border-[#D9E8D9] p-4">
                <p class="text-sm font-semibold text-[#3D5A40]">Maalem couvreur</p>
                <p class="text-sm text-gray-600">Trouver une expertise locale pour vos finitions et réparations de toiture.</p>
            </div>
            <div class="rounded-2xl bg-[#F6FBF6] border border-[#D9E8D9] p-4">
                <p class="text-sm font-semibold text-[#3D5A40]">Électricien / Installateur</p>
                <p class="text-sm text-gray-600">Sélectionnez un artisan fiable pour vos installations électriques ou domotiques.</p>
            </div>
        </div>
        <a href="/maalems" class="inline-flex items-center justify-center mt-8 w-full rounded-lg bg-[#3D5A40] px-6 py-3 text-white font-bold hover:bg-[#2c412f] transition-colors">Voir toutes les Maalems</a>
    </div>

    <div class="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0F4] text-[#21526d] font-semibold text-sm mb-4">
            <i class="ti ti-building"></i>
            Offres Entreprises
        </span>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Entreprises BTP et agences</h2>
        <p class="text-gray-600 leading-7 mb-6">Comparez des sociétés de construction et des agences spécialisées pour vos projets de rénovation, gros œuvre ou aménagement.</p>
        <div class="space-y-3">
            <div class="rounded-2xl bg-[#F3F7FA] border border-[#D1E3EE] p-4">
                <p class="text-sm font-semibold text-[#21526d]">Gros œuvre & structure</p>
                <p class="text-sm text-gray-600">Choisissez une entreprise capable de gérer les fondations, dalles et murs porteurs.</p>
            </div>
            <div class="rounded-2xl bg-[#F3F7FA] border border-[#D1E3EE] p-4">
                <p class="text-sm font-semibold text-[#21526d]">Aménagement intérieur</p>
                <p class="text-sm text-gray-600">Trouvez une agence pour vos finitions, agencements et design d’espaces.</p>
            </div>
        </div>
        <a href="/entreprises" class="inline-flex items-center justify-center mt-8 w-full rounded-lg bg-[#3D5A40] px-6 py-3 text-white font-bold hover:bg-[#2c412f] transition-colors">Voir toutes les entreprises</a>
    </div>
</div>
@endsection
