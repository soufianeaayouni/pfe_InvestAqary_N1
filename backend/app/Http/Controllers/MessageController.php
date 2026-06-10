<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Get all conversations for the authenticated user
     */
    public function conversations(Request $request)
    {
        $userId = auth()->id();
        $conversations = Conversation::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender:id,name', 'receiver:id,name'])
            ->withCount(['messages as unread_count' => function($query) use ($userId) {
                $query->where('user_id', '!=', $userId)->where('read', false);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }

    /**
     * Get messages for a specific conversation
     */
    public function messages(Request $request, $conversationId)
    {
        $userId = auth()->id();
        $conversation = Conversation::where('id', $conversationId)
            ->where(function($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })->firstOrFail();

        // Mark messages as read
        Message::where('conversation_id', $conversationId)
            ->where('user_id', '!=', $userId)
            ->update(['read' => true]);

        $messages = Message::where('conversation_id', $conversationId)
            ->with('user:id,name')
            ->oldest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    public function showContactForm(User $pro)
    {
        if ($pro->role !== 'pro') {
            abort(404);
        }

        return view('messages.contact', ['professional' => $pro]);
    }

    public function sendContactForm(Request $request, User $pro)
    {
        if ($pro->role !== 'pro') {
            abort(404);
        }

        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $senderId = auth()->id();
        $receiverId = $pro->id;

        if ($senderId === $receiverId) {
            return back()->withErrors(['body' => 'Vous ne pouvez pas vous envoyer un message à vous-même.']);
        }

        $conversation = Conversation::where(function($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'last_message_at' => now()
            ]);
        } else {
            $conversation->update(['last_message_at' => now()]);
        }

        Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $senderId,
            'body' => $request->body,
        ]);

        return back()->with('success', 'Message envoyé avec succès.');
    }

    public function showConversation(Request $request, Conversation $conversation)
    {
        $userId = auth()->id();
        if ($conversation->sender_id !== $userId && $conversation->receiver_id !== $userId) {
            abort(403);
        }

        $conversation->load(['sender:id,name', 'receiver:id,name', 'messages.user:id,name']);

        Message::where('conversation_id', $conversation->id)
            ->where('user_id', '!=', $userId)
            ->update(['read' => true]);

        return view('messages.conversation', ['conversation' => $conversation]);
    }

    public function replyConversation(Request $request, Conversation $conversation)
    {
        $userId = auth()->id();
        if ($conversation->sender_id !== $userId && $conversation->receiver_id !== $userId) {
            abort(403);
        }

        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $userId,
            'body' => $request->body,
        ]);

        $conversation->update(['last_message_at' => now()]);

        return back()->with('success', 'Réponse envoyée.');
    }

    /**
     * Send a message via API
     */
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'body' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $senderId = auth()->id();
        $receiverId = $request->receiver_id;

        if ($senderId == $receiverId) {
            return response()->json(['success' => false, 'message' => 'You cannot message yourself.'], 403);
        }

        // Find or create conversation
        $conversation = Conversation::where(function($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'last_message_at' => now()
            ]);
        } else {
            $conversation->update(['last_message_at' => now()]);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $senderId,
            'body' => $request->body,
        ]);

        return response()->json([
            'success' => true,
            'data' => $message->load('user:id,name'),
            'conversation_id' => $conversation->id
        ]);
    }
}
