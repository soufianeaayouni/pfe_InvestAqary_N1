<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with('user.professionalProfile');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'ilike', "%$search%")
                  ->orWhere('description', 'ilike', "%$search%");
            });
        }

        $projects = $query->where('status', 'online')->latest()->get();

        return view('pages.projects.list', compact('projects'));
    }

    public function show($slug)
    {
        $project = Project::with('user.professionalProfile')
            ->where('slug', $slug)
            ->where('status', 'online')
            ->firstOrFail();

        return view('pages.projects.show', compact('project'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'city' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('projects', 'public');
            $imagePath = asset('storage/' . $path);
        }

        $slug = Str::slug($request->title) . '-' . uniqid();

        $project = Project::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'category' => $request->category,
            'location' => $request->city,
            'image' => $imagePath,
            'status' => 'online',
        ]);

        return redirect()->route('dashboard.pro')->with('success', 'Projet ajouté avec succès !');
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        if ($project->user_id !== auth()->id()) {
            return back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'city' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'location' => $request->city,
        ];

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('projects', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $project->update($data);

        return back()->with('success', 'Projet mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        if ($project->user_id !== auth()->id()) {
            return back()->with('error', 'Unauthorized');
        }

        $project->delete();

        return back()->with('success', 'Projet supprimé avec succès.');
    }

    /**
     * Store a project from the web dashboard (Blade form submission).
     */
    public function storeWeb(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'city' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('projects', 'public');
            $imagePath = asset('storage/' . $path);
        }

        $slug = Str::slug($request->title) . '-' . uniqid();

        Project::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'category' => $request->category,
            'location' => $request->city,
            'image' => $imagePath,
            'status' => 'online',
        ]);

        return redirect()->route('dashboard.pro')->with('success', 'Projet ajouté avec succès !');
    }

    /**
     * Delete a project from the web dashboard.
     */
    public function destroyWeb($id)
    {
        \Illuminate\Support\Facades\Log::info("Attempting to delete project ID: {$id} by user: " . auth()->id());

        $project = Project::findOrFail($id);

        if ((int)$project->user_id !== (int)auth()->id()) {
            \Illuminate\Support\Facades\Log::warning("User " . auth()->id() . " tried to delete project {$id} owned by {$project->user_id}");
            abort(403, 'Unauthorized action.');
        }

        $deleted = $project->delete();
        \Illuminate\Support\Facades\Log::info("Project {$id} deletion result: " . ($deleted ? 'success' : 'failed'));

        return back()->with('success', 'Projet supprimé avec succès.');
    }
}
