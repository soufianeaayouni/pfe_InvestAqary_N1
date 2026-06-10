<?php

namespace App\Http\Controllers;

use App\Models\ProfessionalProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function showRegisterClient()
    {
        return view('auth.signup-client');
    }

    public function showRegisterPro()
    {
        return view('auth.signup-pro');
    }

    public function registerClient(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = new User([
            'name' => $request->first_name.' '.$request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);
        $user->role = 'client';
        $user->status = 'active'; // Clients are active immediately, no admin approval needed
        $user->save();

        Auth::login($user);

        return redirect()->to('/dashboard/client')->with('success', 'Inscription réussie.');
    }

    public function registerPro(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'company_name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'type' => 'required|string|in:entreprise,maalem',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'experience' => 'nullable|string',
            'ice' => 'nullable|string',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'banner_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $user = new User([
            'name' => $request->company_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'city' => $request->city,
            'password' => Hash::make($request->password),
        ]);
        $user->role = 'pro';
        $user->status = 'pending'; // New pros await admin activation
        $user->save();

        $profilePhotoPath = null;
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profiles', 'public');
            $profilePhotoPath = asset('storage/' . $path);
        }

        $bannerPhotoPath = null;
        if ($request->hasFile('banner_photo')) {
            $path = $request->file('banner_photo')->store('banners', 'public');
            $bannerPhotoPath = asset('storage/' . $path);
        }

        ProfessionalProfile::create([
            'user_id' => $user->id,
            'company_name' => $request->company_name,
            'category' => $request->category,
            'type' => $request->type ?? 'entreprise',
            'is_verified' => false,
            'description' => $request->description,
            'experience' => $request->experience,
            'ice' => $request->ice,
            'profile_photo' => $profilePhotoPath,
            'banner_photo' => $bannerPhotoPath,
        ]);

        Auth::login($user);

        return redirect()->to('/dashboard/pro')->with('success', 'Inscription réussie. Votre compte est en attente d\'approbation.');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            if ($user->status !== 'active') {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Votre compte est en attente d\'approbation ou a été suspendu.',
                ]);
            }

            if ($user->role === 'admin') {
                return redirect()->intended('/admin');
            } elseif ($user->role === 'pro') {
                return redirect()->intended('/dashboard/pro');
            } else {
                return redirect()->intended('/dashboard/client');
            }
        }

        return back()->withErrors([
            'email' => 'Les identifiants fournis ne correspondent pas à nos enregistrements.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $rules = [
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
        ];

        // Pro-specific validation
        if ($user->role === 'pro') {
            $rules = array_merge($rules, [
                'company_name' => 'nullable|string|max:255',
                'category' => 'nullable|string|max:255',
                'type' => 'nullable|string|in:entreprise,maalem,fournisseur',
                'description' => 'nullable|string',
                'experience' => 'nullable|string',
                'ice' => 'nullable|string|max:50',
                'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
                'banner_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);
        }

        $request->validate($rules);

        $user->fill($request->only(['name', 'email', 'phone', 'city']));
        $user->save();

        // Update ProfessionalProfile if pro
        if ($user->role === 'pro') {
            $profile = ProfessionalProfile::firstOrCreate(['user_id' => $user->id]);

            $profileData = $request->only(['company_name', 'category', 'type', 'description', 'experience', 'ice']);

            if ($request->hasFile('profile_photo')) {
                $path = $request->file('profile_photo')->store('profiles', 'public');
                $profileData['profile_photo'] = Storage::disk('public')->url($path);
            }

            if ($request->hasFile('banner_photo')) {
                $path = $request->file('banner_photo')->store('banners', 'public');
                $profileData['banner_photo'] = Storage::disk('public')->url($path);
            }

            $profile->fill($profileData);
            $profile->save();

            // Keep user name in sync with company name
            if ($request->filled('company_name')) {
                $user->name = $request->company_name;
                $user->save();
            }
        }

        return back()->with('success', 'Profil mis à jour avec succès.');
    }
}
