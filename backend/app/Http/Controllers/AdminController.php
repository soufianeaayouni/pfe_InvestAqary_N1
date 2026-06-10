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
        return redirect()->route('dashboard.admin')->with('info', 'Stats endpoint removed.');
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
            return redirect()->back()->with('error', 'Vous ne pouvez pas changer votre propre statut.');
        }

        $user->status = $request->status;
        $user->save();

        return redirect()->back()->with('success', 'Statut du compte mis à jour avec succès.');
    }

    /**
     * Get all products
     */
    public function products()
    {
        return redirect()->route('dashboard.admin')->with('info', 'Products endpoint removed.');
    }

    /**
     * Toggle product status
     */
    public function toggleProductStatus($id)
    {
        $product = Product::findOrFail($id);
        $product->status = $product->status === 'online' ? 'offline' : 'online';
        $product->save();
        return redirect()->back()->with('success', 'Product status mis à jour.');
    }

    /**
     * Delete a product
     */
    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return redirect()->back()->with('success', 'Produit supprimé.');
    }

    /**
     * Get all users
     */
    public function users(Request $request)
    {
        return redirect()->route('dashboard.admin')->with('info', 'Users endpoint removed.');
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
        return redirect()->back()->with('success', 'Utilisateur supprimé.');
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

        return redirect()->back()->with('success', 'Vérification utilisateur basculée.');
    }

    /**
     * Get all simulations
     */
    public function simulations()
    {
        return redirect()->route('dashboard.admin')->with('info', 'Simulations endpoint removed.');
    }

    /**
     * Get all projects (including offline)
     */
    public function projects()
    {
        return redirect()->route('dashboard.admin')->with('info', 'Projects endpoint removed.');
    }

    /**
     * Toggle project status
     */
    public function toggleProjectStatus($id)
    {
        $project = Project::findOrFail($id);
        $project->status = $project->status === 'online' ? 'offline' : 'online';
        $project->save();
        return redirect()->back()->with('success', 'Project status mis à jour.');
    }

    /**
     * Delete a project
     */
    public function deleteProject($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return redirect()->back()->with('success', 'Projet supprimé.');
    }

    /**
     * Delete a simulation
     */
    public function deleteSimulation($id)
    {
        $simulation = Simulation::findOrFail($id);
        $simulation->delete();
        return redirect()->back()->with('success', 'Simulation supprimée.');
    }
}
