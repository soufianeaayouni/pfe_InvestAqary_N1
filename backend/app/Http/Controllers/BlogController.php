<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of the blog posts.
     */
    public function index(Request $request)
    {
        $query = Post::where('status', 'published')
            ->where(function($q) {
                $q->whereNull('published_at')
                  ->orWhere('published_at', '<=', now());
            })
            ->with('author');

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Search in title or content
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('content', 'ilike', "%{$search}%");
            });
        }

        $posts = $query->latest('published_at')->paginate(9);

        // Get all unique categories for sidebar filters
        $categories = Post::where('status', 'published')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');

        // Get recent posts for sidebar
        $recentPosts = Post::where('status', 'published')
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('pages.blog.index', compact('posts', 'categories', 'recentPosts'));
    }

    /**
     * Display the specified blog post.
     */
    public function show($slug)
    {
        $post = Post::where('slug', $slug)
            ->where('status', 'published')
            ->with('author')
            ->firstOrFail();

        // Get related posts (same category, excluding current post)
        $relatedPosts = Post::where('status', 'published')
            ->where('category', $post->category)
            ->where('id', '!=', $post->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('pages.blog.show', compact('post', 'relatedPosts'));
    }
}
