<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Conversation;
use App\Models\ProfessionalProfile;
use App\Models\Simulation;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function client()
    {
        $user = Auth::user();
        
        if ($user->role !== 'client') {
            return redirect('/');
        }

        $simulations = \App\Models\Simulation::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $simulationCount = $simulations->count();
        
        return view('dashboard.client', compact('user', 'simulations', 'simulationCount'));
    }

    public function pro()
    {
        $user = Auth::user();
        
        if ($user->role !== 'pro') {
            return redirect('/');
        }
        
        $profile = ProfessionalProfile::where('user_id', $user->id)->first();
        $projects = \App\Models\Project::where('user_id', $user->id)->latest()->get();
        $conversations = Conversation::where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->with(['sender:id,name', 'receiver:id,name', 'messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->withCount(['messages as unread_count' => function ($query) use ($user) {
                $query->where('user_id', '!=', $user->id)->where('read', false);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();
        
        return view('dashboard.pro', compact('user', 'profile', 'projects', 'conversations'));
    }

    public function admin()
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return redirect('/');
        }
        
        $usersCount = User::count();
        $prosCount = User::where('role', 'pro')->count();
        $clientsCount = User::where('role', 'client')->count();
        $projectsCount = \App\Models\Project::count();
        $productsCount = \App\Models\Product::count();
        $simulationsCount = Simulation::count();
        $pendingUsersCount = User::where('status', 'pending')->count();
        $pendingUsers = User::where('status', 'pending')->with('professionalProfile')->latest()->take(10)->get();
        $unverifiedProsCount = User::where('role', 'pro')
            ->whereHas('professionalProfile', function ($query) {
                $query->where('is_verified', false);
            })->count();
        $recentUsers = User::with('professionalProfile')->latest()->take(5)->get();
        $allUsers = User::with('professionalProfile')->latest()->get();

        return view('dashboard.admin', compact(
            'user',
            'usersCount',
            'prosCount',
            'clientsCount',
            'projectsCount',
            'productsCount',
            'simulationsCount',
            'pendingUsersCount',
            'pendingUsers',
            'unverifiedProsCount',
            'recentUsers',
            'allUsers'
        ));
    }
}
