<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Product;
use App\Models\Simulation;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get dashboard stats
     */
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'total_pros' => User::where('role', 'pro')->count(),
                'total_clients' => User::where('role', 'client')->count(),
                'total_projects' => Project::count(),
                'total_products' => Product::count(),
                'total_simulations' => Simulation::count(),
                'unverified_pros_count' => User::where('role', 'pro')
                    ->whereHas('professionalProfile', function($query) {
                        $query->where('is_verified', false);
                    })->count(),
                'pending_users_count' => User::where('status', 'pending')->count(),
                'recent_activities' => $this->getRecentActivities(),
            ]
        ]);
    }

    private function getRecentActivities()
    {
        $activities = [];

        // Recent users
        $newUsers = User::latest()->take(3)->get();
        foreach ($newUsers as $u) {
            $activities[] = [
                'type' => 'user_registered',
                'title' => 'Nouveau compte: ' . $u->name,
                'time' => $u->created_at->diffForHumans(),
                'icon' => 'ti-user-plus',
                'color' => 'text-blue-500'
            ];
        }

        // Recent leads
        $recentLeads = \App\Models\Lead::latest()->take(3)->get();
        foreach ($recentLeads as $l) {
            $activities[] = [
                'type' => 'new_lead',
                'title' => 'Nouvelle demande pour ' . ($l->professional->name ?? 'Pro'),
                'time' => $l->created_at->diffForHumans(),
                'icon' => 'ti-file-text',
                'color' => 'text-orange-500'
            ];
        }

        // Sort by time (actually we can just merge and take 5)
        return collect($activities)->sortByDesc('time')->take(5)->values();
    }

    /**
     * Approve or reject user status
     */
    public function updateUserStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:active,pending,suspended'
        ]);

        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Cannot change your own status'], 400);
        }

        $user->status = $request->status;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Get all products
     */
    public function products()
    {
        $products = Product::with('user.professionalProfile')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Toggle product status
     */
    public function toggleProductStatus($id)
    {
        $product = Product::findOrFail($id);
        $product->status = $product->status === 'online' ? 'offline' : 'online';
        $product->save();
        
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Delete a product
     */
    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Get all users
     */
    public function users(Request $request)
    {
        $users = User::with('professionalProfile')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Delete a user
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Don't delete self
        if ($user->id === auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Cannot delete yourself'], 400);
        }

        $user->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Toggle user (pro) verification status
     */
    public function toggleUserVerification($id)
    {
        $user = User::with('professionalProfile')->findOrFail($id);
        
        if (!$user->professionalProfile) {
            return response()->json(['success' => false, 'message' => 'User has no professional profile'], 400);
        }

        $user->professionalProfile->is_verified = !$user->professionalProfile->is_verified;
        $user->professionalProfile->save();
        
        return response()->json([
            'success' => true,
            'data' => $user->fresh('professionalProfile')
        ]);
    }

    /**
     * Get all simulations
     */
    public function simulations()
    {
        $simulations = Simulation::with('user')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $simulations
        ]);
    }

    /**
     * Get all projects (including offline)
     */
    public function projects()
    {
        $projects = Project::with('user.professionalProfile')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    /**
     * Toggle project status
     */
    public function toggleProjectStatus($id)
    {
        $project = Project::findOrFail($id);
        $project->status = $project->status === 'online' ? 'offline' : 'online';
        $project->save();
        
        return response()->json([
            'success' => true,
            'data' => $project
        ]);
    }

    /**
     * Delete a project
     */
    public function deleteProject($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Delete a simulation
     */
    public function deleteSimulation($id)
    {
        $simulation = Simulation::findOrFail($id);
        $simulation->delete();
        return response()->json(['success' => true]);
    }
}
