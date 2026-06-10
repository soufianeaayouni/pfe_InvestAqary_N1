@extends('layouts.app')

@section('content')
@php
    $htmlContent = $post->content;
    
    // Convert headers (### Header)
    $htmlContent = preg_replace('/###\s+(.*?)(?:\n|$)/', '<h3 class="text-2xl font-black text-gray-900 mt-10 mb-4">$1</h3>', $htmlContent);
    
    // Convert bold (**text**)
    $htmlContent = preg_replace('/\*\*(.*?)\*\*/', '<strong class="font-bold text-gray-950">$1</strong>', $htmlContent);
    
    // Convert bullet points (* item)
    $lines = explode("\n", $htmlContent);
    $inList = false;
    foreach ($lines as $key => $line) {
        $trimmed = trim($line);
        if (str_starts_with($trimmed, '* ')) {
            $lineContent = substr($trimmed, 2);
            if (!$inList) {
                $lines[$key] = '<ul class="list-none pl-0 my-6 space-y-3">' . "\n" . '<li class="flex items-start gap-3 text-gray-700"><i class="ti ti-circle-check-filled text-[#3D5A40] mt-1 text-sm flex-shrink-0"></i><span>' . $lineContent . '</span></li>';
                $inList = true;
            } else {
                $lines[$key] = '<li class="flex items-start gap-3 text-gray-700"><i class="ti ti-circle-check-filled text-[#3D5A40] mt-1 text-sm flex-shrink-0"></i><span>' . $lineContent . '</span></li>';
            }
        } else {
            if ($inList && !empty($trimmed)) {
                $lines[$key] = '</ul>' . "\n" . $line;
                $inList = false;
            }
        }
    }
    if ($inList) {
        $lines[] = '</ul>';
    }
    $htmlContent = implode("\n", $lines);
    
    // nl2br for paragraph breaks (excluding list tags and header tags)
    $htmlContent = nl2br($htmlContent);
    // Remove extra break tags that might occur near headers/lists
    $htmlContent = str_replace(['</h3><br />', '</ul><br />', '<li><br />'], ['</h3>', '</ul>', '<li>'], $htmlContent);
@endphp

<div class="bg-gray-50 min-h-screen pb-24 font-sans">
    
    <!-- Top breadcrumb/header area -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <a href="{{ route('blog.index') }}" class="inline-flex items-center gap-2 text-sm font-bold text-[#3D5A40] hover:text-[#2c412f] transition-colors mb-6 group">
            <i class="ti ti-arrow-narrow-left group-hover:-translate-x-1 transition-transform"></i> Retour au blog
        </a>
        
        <div class="space-y-4">
            @if($post->category)
                <a href="{{ route('blog.index', ['category' => $post->category]) }}" class="inline-block px-3 py-1 bg-green-50 text-[#3D5A40] text-xs font-bold rounded-full uppercase tracking-wider">
                    {{ $post->category }}
                </a>
            @endif
            
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {{ $post->title }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-gray-500 font-medium border-b border-gray-200 pb-6">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-green-50 text-[#3D5A40] flex items-center justify-center font-bold text-sm border border-gray-150">
                        {{ substr($post->author->name ?? 'A', 0, 1) }}
                    </div>
                    <span class="text-gray-700 font-semibold">{{ $post->author->name ?? 'Admin' }}</span>
                </div>
                <span class="text-gray-300">|</span>
                <span class="flex items-center gap-1.5"><i class="ti ti-calendar"></i> {{ $post->published_at ? $post->published_at->format('d M Y') : $post->created_at->format('d M Y') }}</span>
                <span class="text-gray-300">|</span>
                <span class="flex items-center gap-1.5"><i class="ti ti-clock"></i> {{ ceil(str_word_count(strip_tags($post->content)) / 200) }} min de lecture</span>
            </div>
        </div>
    </div>

    <!-- Featured Image Section -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div class="rounded-3xl overflow-hidden shadow-lg h-[350px] sm:h-[450px] md:h-[500px] bg-gray-150">
            @if($post->image)
                <img src="{{ $post->image }}" alt="{{ $post->title }}" class="w-full h-full object-cover">
            @else
                <div class="w-full h-full bg-gradient-to-br from-[#A7C4BC]/30 to-[#3D5A40]/20 flex items-center justify-center text-7xl text-[#3D5A40]">
                    <i class="ti ti-photo"></i>
                </div>
            @endif
        </div>
    </div>

    <!-- Article Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-10 md:p-12">
            
            <div class="prose max-w-none text-gray-700 leading-relaxed text-base sm:text-lg space-y-6">
                {!! $htmlContent !!}
            </div>

            <!-- Author Signature Box -->
            <div class="mt-12 pt-8 border-t border-gray-150 flex flex-col sm:flex-row items-center gap-5 bg-gray-50 rounded-2xl p-6 sm:p-8">
                <div class="w-16 h-16 rounded-full bg-[#3D5A40] text-white flex items-center justify-center text-2xl font-bold shadow-md">
                    {{ substr($post->author->name ?? 'A', 0, 1) }}
                </div>
                <div class="space-y-1 text-center sm:text-left flex-1">
                    <h4 class="text-lg font-bold text-gray-900">Rédigé par {{ $post->author->name ?? 'L\'Équipe InvestAqary' }}</h4>
                    <p class="text-sm text-gray-550 leading-normal">
                        Experts en aménagement et construction au Maroc, notre mission est de vous accompagner avec des conseils avisés et les meilleurs outils pour vos projets de vie.
                    </p>
                </div>
            </div>

        </div>
    </div>

    <!-- Related Articles Section -->
    @if($relatedPosts->isNotEmpty())
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <h3 class="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
                <i class="ti ti-grid-dots text-[#3D5A40] text-2xl"></i> Articles recommandés
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                @foreach($relatedPosts as $related)
                    <a href="{{ route('blog.show', $related->slug) }}" class="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full">
                        <div class="h-44 bg-gray-100 overflow-hidden relative">
                            @if($related->image)
                                <img src="{{ $related->image }}" alt="{{ $related->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            @else
                                <div class="w-full h-full bg-[#A7C4BC]/10 flex items-center justify-center text-[#3D5A40]">
                                    <i class="ti ti-photo text-3xl"></i>
                                </div>
                            @endif
                        </div>
                        <div class="p-5 flex-1 flex flex-col justify-between">
                            <div class="space-y-2">
                                <span class="text-[11px] font-bold text-[#3D5A40] uppercase">{{ $related->category }}</span>
                                <h4 class="text-base font-bold text-gray-900 group-hover:text-[#3D5A40] transition-colors line-clamp-2 leading-snug">
                                    {{ $related->title }}
                                </h4>
                            </div>
                            <span class="inline-flex items-center gap-1 text-xs font-bold text-[#3D5A40] mt-4">
                                Lire l'article <i class="ti ti-arrow-narrow-right group-hover:translate-x-1 transition-transform"></i>
                            </span>
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    @endif

</div>
@endsection
