@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen py-10">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div class="bg-[#3D5A40] px-8 py-8 text-white">
                <h1 class="text-3xl font-bold">Conversation avec {{ $conversation->sender_id === auth()->id() ? $conversation->receiver->name : $conversation->sender->name }}</h1>
                <p class="mt-2 text-gray-200">Suivez les messages échangés avec ce contact et répondez directement.</p>
            </div>

            <div class="p-8">
                @if(session('success'))
                    <div class="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                        {{ session('success') }}
                    </div>
                @endif

                <div class="space-y-4 mb-8">
                    @foreach($conversation->messages as $message)
                        <div class="rounded-3xl p-5 border border-gray-200 {{ $message->user_id === auth()->id() ? 'bg-[#E8F5E9] ml-auto max-w-[80%]' : 'bg-white max-w-[85%]' }}">
                            <div class="flex items-center justify-between gap-3 mb-2 text-xs text-gray-500">
                                <span>{{ $message->user->name }}</span>
                                <span>{{ $message->created_at->format('d M Y H:i') }}</span>
                            </div>
                            <p class="text-sm text-gray-700 whitespace-pre-line">{{ $message->body }}</p>
                        </div>
                    @endforeach
                </div>

                <form action="{{ route('messages.reply', $conversation->id) }}" method="POST">
                    @csrf
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Votre réponse</label>
                            <textarea name="body" rows="5" class="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#3D5A40] focus:ring-0" placeholder="Écrire votre réponse..."></textarea>
                        </div>
                        <button type="submit" class="inline-flex items-center gap-2 rounded-2xl bg-[#3D5A40] px-6 py-3 text-white font-semibold hover:bg-[#2c412f] transition-colors">
                            <i class="ti ti-send"></i> Envoyer la réponse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
