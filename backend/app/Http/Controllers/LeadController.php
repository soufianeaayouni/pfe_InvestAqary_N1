<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = auth()->id();
        $userRole = auth()->user()->role;

        if ($userRole === 'pro') {
            $leads = Lead::where('pro_id', $userId)
                ->with('client:id,name,email,city')
                ->latest()
                ->get();
        } else {
            $leads = Lead::where('client_id', $userId)
                ->with('professional:id,name,email')
                ->latest()
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $leads
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,accepted,rejected',
            'price' => 'nullable|numeric',
            'pro_notes' => 'nullable|string'
        ]);

        $lead = Lead::findOrFail($id);
        
        // Ensure only the assigned professional can update
        if ($lead->pro_id != auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $lead->update($request->only(['status', 'price', 'pro_notes']));

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully',
            'data' => $lead->load('client:id,name,email,city')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'required|string',
            'pro_id' => 'nullable|exists:users,id',
        ]);

        $lead = Lead::create([
            'client_id' => auth()->id(),
            'pro_id' => $request->pro_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'phone' => $request->phone,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'data' => $lead
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $lead = Lead::findOrFail($id);
        $user = auth()->user();

        // Only the pro assigned to the lead can update it (e.g., status, price)
        if ($user->role === 'pro' && $lead->pro_id === $user->id) {
            $lead->update($request->only(['status', 'price', 'pro_notes', 'quote_details']));
        } 
        // Or the client can cancel it
        elseif ($user->id === $lead->client_id) {
            if ($request->has('status') && $request->status === 'cancelled') {
                $lead->status = 'cancelled';
                $lead->save();
            }
        } else {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $lead
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $lead = Lead::findOrFail($id);
        
        if ($lead->client_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted'
        ]);
    }
}
