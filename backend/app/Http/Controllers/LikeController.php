<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    /**
     * Toggle a like on a professional profile.
     */
    public function toggleLike(Request $request, $proId)
    {
        $user = $request->user();
        
        $pro = User::where('role', 'pro')->find($proId);
        
        if (!$pro) {
            return response()->json([
                'success' => false,
                'message' => 'Professionnel non trouvé.'
            ], 404);
        }

        $isLiked = $user->likesSent()->where('pro_id', $proId)->exists();

        if ($isLiked) {
            $user->likesSent()->detach($proId);
            $action = 'unliked';
        } else {
            $user->likesSent()->attach($proId);
            $action = 'liked';
        }

        return response()->json([
            'success' => true,
            'message' => "Action $action avec succès.",
            'action' => $action
        ]);
    }

    /**
     * Get the list of professionals the authenticated user has liked.
     */
    public function getMyLikes(Request $request)
    {
        $user = $request->user();
        $likes = $user->likesSent()->with('professionalProfile')->get();

        return response()->json([
            'success' => true,
            'data' => $likes
        ]);
    }

    /**
     * Get the list of users who have liked the authenticated professional.
     */
    public function getLikesReceived(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'pro') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé.'
            ], 403);
        }

        $likers = $user->likesReceived()->get();

        return response()->json([
            'success' => true,
            'data' => $likers
        ]);
    }
}
