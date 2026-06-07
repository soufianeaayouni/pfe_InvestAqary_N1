<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\ProfileViewLog;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    /**
     * Get all professionals (Companies and Maalems)
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'pro')->where('status', 'active')->with('professionalProfile');

        // Filter by type (entreprise or maalem)
        if ($request->has('type')) {
            $type = $request->type;
            $query->whereHas('professionalProfile', function ($q) use ($type) {
                $q->where('type', $type);
            });
        }

        // Filter by category if provided - Flexible matching
        if ($request->has('category')) {
            $category = $request->category;
            $query->whereHas('professionalProfile', function ($q) use ($category) {
                $q->where('category', 'ilike', "%$category%");
            });
        }

        // Search by name or company name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%$search%")
                  ->orWhereHas('professionalProfile', function ($sub) use ($search) {
                      $sub->where('company_name', 'ilike', "%$search%");
                  });
            });
        }

        $professionals = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $professionals
        ]);
    }

    /**
     * Get a specific professional by slug (using name for now as slug)
     */
    public function show($id)
    {
        $professional = User::where('role', 'pro')
            ->where('status', 'active')
            ->with('professionalProfile')
            ->find($id);

        if (!$professional) {
            return response()->json([
                'success' => false,
                'message' => 'Professional not found'
            ], 404);
        }

        $viewerId = auth()->id();
        if ($viewerId !== (int) $professional->id) {
            $this->recordProfileView($professional);
        }

        return response()->json([
            'success' => true,
            'data' => $professional
        ]);
    }

    /**
     * Dashboard stats for authenticated pro user
     */
    public function stats()
    {
        $user = auth()->user();
        if ($user->role !== 'pro') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $profile = $user->professionalProfile;
        $profileViews = $profile?->profile_views ?? 0;

        $thisWeekStart = Carbon::now()->startOfWeek();
        $lastWeekStart = $thisWeekStart->copy()->subWeek();

        $thisWeekViews = ProfileViewLog::where('pro_id', $user->id)
            ->where('viewed_at', '>=', $thisWeekStart)
            ->count();

        $lastWeekViews = ProfileViewLog::where('pro_id', $user->id)
            ->where('viewed_at', '>=', $lastWeekStart)
            ->where('viewed_at', '<', $thisWeekStart)
            ->count();

        if ($lastWeekViews > 0) {
            $weekChangePercent = round((($thisWeekViews - $lastWeekViews) / $lastWeekViews) * 100);
        } else {
            $weekChangePercent = $thisWeekViews > 0 ? 100 : 0;
        }

        $pendingLeads = Lead::where('pro_id', $user->id)
            ->where('status', 'pending')
            ->count();

        $reviewsQuery = Review::where('pro_id', $user->id);
        $reviewsCount = (clone $reviewsQuery)->count();
        $averageRating = $reviewsCount > 0
            ? round((clone $reviewsQuery)->avg('rating'), 1)
            : null;

        return response()->json([
            'success' => true,
            'data' => [
                'profile_views' => $profileViews,
                'profile_views_week_change' => $weekChangePercent,
                'pending_leads' => $pendingLeads,
                'average_rating' => $averageRating,
                'reviews_count' => $reviewsCount,
            ],
        ]);
    }

    private function recordProfileView(User $professional): void
    {
        if (!$professional->professionalProfile) {
            return;
        }

        $professional->professionalProfile->increment('profile_views');

        ProfileViewLog::create([
            'pro_id' => $professional->id,
            'viewed_at' => now(),
        ]);
    }

    /**
     * Update professional profile
     */
    public function update(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'pro') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $user->update($request->only(['name', 'phone', 'city']));

        if ($user->professionalProfile) {
            $user->professionalProfile->update($request->only([
                'company_name',
                'category',
                'description',
                'experience',
                'ice'
            ]));
        }

        return response()->json([
            'success' => true,
            'data' => $user->load('professionalProfile')
        ]);
    }
}
