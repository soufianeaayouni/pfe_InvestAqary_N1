@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen pb-20 pt-10 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Hero Section -->
        <div class="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-[#3D5A40] to-[#2c412f] text-white py-16 px-8 md:px-16 shadow-xl">
            <!-- Decorative shapes -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div class="absolute bottom-0 left-0 w-80 h-80 bg-[#A7C4BC]/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div class="relative z-10 max-w-2xl">
                <span class="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider text-green-200 uppercase mb-4">
                    Guides & Actualités
                </span>
                <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                    Le Blog de l'Immobilier et de la Construction au Maroc
                </h1>
                <p class="text-green-100 text-lg font-medium leading-relaxed mb-8">
                    Découvrez nos conseils d'experts, guides de construction, tendances d'aménagement et comparatifs de matériaux pour réussir tous vos projets.
                </p>

                <!-- Search Bar -->
                <form action="{{ route('blog.index') }}" method="GET" class="flex flex-col sm:flex-row gap-3">
                    @if(request('category'))
                        <input type="hidden" name="category" value="{{ request('category') }}">
                    @endif
                    <div class="relative flex-1">
                        <i class="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                        <input type="text" name="search" value="{{ request('search') }}" placeholder="Rechercher un article, un guide..." class="w-full pl-12 pr-4 py-3.5 rounded-xl border-none bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#A7C4BC] outline-none text-sm shadow-inner">
                    </div>
                    <button type="submit" class="px-6 py-3.5 bg-white text-[#3D5A40] font-bold rounded-xl hover:bg-green-50 transition-all shadow-md text-sm sm:w-auto">
                        Rechercher
                    </button>
                </form>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Articles List -->
            <div class="lg:col-span-8 space-y-10">
                
                @if($posts->isEmpty())
                    <div class="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-300">
                            <i class="ti ti-news-off text-3xl text-gray-400"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
                        <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
                            Nous n'avons trouvé aucun article correspondant à vos critères de recherche. Essayez d'autres mots-clés ou parcourez une autre catégorie.
                        </p>
                        <a href="{{ route('blog.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D5A40] text-white rounded-lg text-sm font-semibold hover:bg-[#2c412f] transition-all">
                            Voir tous les articles
                        </a>
                    </div>
                @else
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        @foreach($posts as $post)
                            <article class="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full">
                                <!-- Featured Image -->
                                <div class="h-52 bg-gray-100 overflow-hidden relative">
                                    @if($post->image)
                                        <img src="{{ $post->image }}" alt="{{ $post->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                    @else
                                        <div class="w-full h-full bg-gradient-to-br from-[#A7C4BC]/30 to-[#3D5A40]/20 flex items-center justify-center text-4xl text-[#3D5A40]">
                                            <i class="ti ti-photo"></i>
                                        </div>
                                    @endif
                                    
                                    @if($post->category)
                                        <a href="{{ route('blog.index', ['category' => $post->category]) }}" class="absolute top-4 left-4 inline-block px-3 py-1 bg-[#3D5A40] text-white text-xs font-semibold rounded-full hover:bg-[#2c412f] transition-colors shadow-sm">
                                            {{ $post->category }}
                                        </a>
                                    @endif
                                </div>

                                <!-- Article Body -->
                                <div class="p-6 flex-1 flex flex-col justify-between">
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                            <span class="flex items-center gap-1"><i class="ti ti-calendar"></i> {{ $post->published_at ? $post->published_at->format('d M Y') : $post->created_at->format('d M Y') }}</span>
                                            <span>•</span>
                                            <span class="flex items-center gap-1"><i class="ti ti-clock"></i> {{ ceil(str_word_count(strip_tags($post->content)) / 200) }} min de lecture</span>
                                        </div>
                                        
                                        <h3 class="text-xl font-bold text-gray-900 group-hover:text-[#3D5A40] transition-colors line-clamp-2">
                                            <a href="{{ route('blog.show', $post->slug) }}">
                                                {{ $post->title }}
                                            </a>
                                        </h3>
                                        
                                        <p class="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                                            {{ Str::limit(strip_tags($post->content), 120) }}
                                        </p>
                                    </div>

                                    <div class="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-8 h-8 rounded-full bg-green-50 text-[#3D5A40] flex items-center justify-center font-bold text-sm border border-gray-200">
                                                {{ substr($post->author->name ?? 'A', 0, 1) }}
                                            </div>
                                            <span class="text-xs font-semibold text-gray-700">{{ $post->author->name ?? 'Admin' }}</span>
                                        </div>
                                        <a href="{{ route('blog.show', $post->slug) }}" class="inline-flex items-center gap-1 text-sm font-bold text-[#3D5A40] hover:text-[#2c412f] group-hover:translate-x-1 transition-all">
                                            Lire l'article <i class="ti ti-arrow-narrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        @endforeach
                    </div>

                    <!-- Pagination -->
                    <div class="pt-6">
                        {{ $posts->appends(request()->query())->links() }}
                    </div>
                @endif

            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-4 space-y-8">
                
                <!-- Category Filter Box -->
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="ti ti-category text-[#3D5A40] text-xl"></i> Catégories
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        <a href="{{ route('blog.index', request()->except(['category', 'page'])) }}" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all {{ !request('category') ? 'bg-[#3D5A40] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200' }}">
                            Tous les articles
                        </a>
                        @foreach($categories as $cat)
                            <a href="{{ route('blog.index', array_merge(request()->query(), ['category' => $cat])) }}" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all {{ request('category') === $cat ? 'bg-[#3D5A40] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200' }}">
                                {{ $cat }}
                            </a>
                        @endforeach
                    </div>
                </div>

                <!-- Recent Posts Box -->
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="ti ti-news text-[#3D5A40] text-xl"></i> Articles Récents
                    </h3>
                    <div class="space-y-4">
                        @foreach($recentPosts as $recent)
                            <a href="{{ route('blog.show', $recent->slug) }}" class="flex gap-3.5 group items-center">
                                <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    @if($recent->image)
                                        <img src="{{ $recent->image }}" alt="{{ $recent->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                    @else
                                        <div class="w-full h-full bg-[#A7C4BC]/20 flex items-center justify-center text-[#3D5A40]">
                                            <i class="ti ti-photo"></i>
                                        </div>
                                    @endif
                                </div>
                                <div class="space-y-1">
                                    <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#3D5A40] transition-colors line-clamp-2 leading-tight">
                                        {{ $recent->title }}
                                    </h4>
                                    <span class="text-[11px] text-gray-400 flex items-center gap-1">
                                        <i class="ti ti-calendar"></i> {{ $recent->published_at ? $recent->published_at->format('d M Y') : $recent->created_at->format('d M Y') }}
                                    </span>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>

                <!-- Banner/Ad Box -->
                <div class="rounded-3xl overflow-hidden bg-gradient-to-br from-[#A7C4BC]/20 to-[#3D5A40]/10 border border-[#3D5A40]/10 p-6 text-center shadow-inner relative">
                    <div class="relative z-10 space-y-4">
                        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-[#3D5A40] text-xl">
                            <i class="ti ti-calculator"></i>
                        </div>
                        <h4 class="text-base font-bold text-gray-900 leading-snug">
                            Vous préparez un projet de construction ?
                        </h4>
                        <p class="text-xs text-gray-600 leading-relaxed max-w-[220px] mx-auto">
                            Estimez votre budget gros œuvre et finitions en quelques clics grâce à notre simulateur interactif.
                        </p>
                        <a href="/simulateur" class="inline-block w-full py-2.5 bg-[#3D5A40] text-white rounded-xl text-xs font-bold hover:bg-[#2c412f] transition-all shadow-md">
                            Lancer le simulateur
                        </a>
                    </div>
                </div>

            </div>

        </div>

    </div>
</div>
@endsection
