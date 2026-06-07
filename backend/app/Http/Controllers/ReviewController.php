<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index($proId)
    {
        $reviews = Review::where('pro_id', $proId)
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pro_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if user is trying to review themselves
        if (auth()->id() == $request->pro_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot review yourself.'
            ], 403);
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'pro_id' => $request->pro_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review added successfully.',
            'data' => $review->load('user:id,name')
        ], 201);
    }
}
