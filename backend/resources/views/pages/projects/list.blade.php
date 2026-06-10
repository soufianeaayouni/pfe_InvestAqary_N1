@extends('layouts.app')

@section('content')
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
    <h1 class="text-3xl font-black text-gray-900 mb-6">Projets</h1>

    @if($projects->count() > 0)
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($projects as $project)
                <a href="{{ route('projects.show', $project->slug) }}" class="block bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md">
                    <div class="h-44 bg-gray-100 overflow-hidden">
                        @if($project->image)
                            <img src="{{ $project->image }}" alt="{{ $project->title }}" class="w-full h-full object-cover">
                        @else
                            <div class="w-full h-full flex items-center justify-center text-gray-400">
                                <i class="ti ti-photo text-4xl"></i>
                            </div>
                        @endif
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900">{{ $project->title }}</h3>
                        <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ Str::limit($project->description, 100) }}</p>
                    </div>
                </a>
            @endforeach
        </div>
    @else
        <div class="bg-white rounded-xl border border-gray-150 p-8 text-center text-gray-500">
            <i class="ti ti-photo-off text-4xl mb-3"></i>
            <p>Aucun projet publié pour le moment.</p>
        </div>
    @endif
</div>
@endsection
