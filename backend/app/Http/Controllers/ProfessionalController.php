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
    public function entreprises(Request $request)
    {
        return $this->listByType($request, 'entreprise');
    }

    public function maalems(Request $request)
    {
        return $this->listByType($request, 'maalem');
    }

    public function fournisseurs(Request $request)
    {
        return $this->listByType($request, 'fournisseur');
    }

    /**
     * Shared listing logic filtered by type
     */
    private function listByType(Request $request, string $type)
    {
        $query = User::where('role', 'pro')
            ->where('status', 'active')
            ->with('professionalProfile')
            ->whereHas('professionalProfile', function ($q) use ($type) {
                $q->where('type', $type);
            });

        if ($request->filled('category')) {
            $category = $request->category;
            $query->whereHas('professionalProfile', function ($q) use ($category) {
                $q->where('category', 'ilike', "%$category%");
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%$search%")
                  ->orWhereHas('professionalProfile', function ($sub) use ($search) {
                      $sub->where('company_name', 'ilike', "%$search%");
                  });
            });
        }

        $professionals = $query->latest()->paginate(12);

        return view('pages.professionals-list', compact('professionals', 'type'));
    }

    public function show($id)
    {
        $professional = User::where('role', 'pro')
            ->where('status', 'active')
            ->with(['professionalProfile', 'projects' => function ($query) {
                $query->where('status', 'online')->latest();
            }])
            ->find($id);

        if (!$professional) {
            return redirect('/')->withErrors('Professionnel introuvable.');
        }

        // Record profile view (non-blocking)
        try {
            $viewerId = auth()->id();
            if ($viewerId !== (int) $professional->id) {
                $this->recordProfileView($professional);
            }
        } catch (\Exception $e) {
            // Silently fail — don't block the page
        }

        return view('pages.professional-detail', compact('professional'));
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
