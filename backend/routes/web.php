<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;

Route::get('/', function () {
    return view('pages.home');
});

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/inscription-client', [AuthController::class, 'showRegisterClient'])->name('register.client');
    Route::post('/register/client', [AuthController::class, 'registerClient']);
    
    Route::get('/inscription-pro', [AuthController::class, 'showRegisterPro'])->name('register.pro');
    Route::post('/register/pro', [AuthController::class, 'registerPro']);
});

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfessionalController;
use App\Http\Controllers\BlogController;

Route::get('/entreprises', [ProfessionalController::class, 'entreprises'])->name('entreprises');
Route::get('/maalems', [ProfessionalController::class, 'maalems'])->name('maalems');
Route::get('/fournisseurs', [ProfessionalController::class, 'fournisseurs'])->name('fournisseurs');

Route::get('/pro/{id}', [ProfessionalController::class, 'show'])->name('pro.show');
Route::get('/projet/{slug}', [App\Http\Controllers\ProjectController::class, 'show'])->name('projects.show');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

Route::get('/simulateur', function () {
    return view('pages.simulateur');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
    
    // Dashboards
    Route::get('/dashboard/client', [DashboardController::class, 'client'])->name('dashboard.client');
    Route::get('/dashboard/pro', [DashboardController::class, 'pro'])->name('dashboard.pro');
    Route::get('/admin', [DashboardController::class, 'admin'])->middleware('admin')->name('dashboard.admin');

    // Pro Projects (web)
    Route::post('/dashboard/pro/projects', [App\Http\Controllers\ProjectController::class, 'storeWeb'])->name('pro.projects.store');
    Route::delete('/dashboard/pro/projects/{id}', [App\Http\Controllers\ProjectController::class, 'destroyWeb'])->name('pro.projects.destroy');

    // Admin user management
    Route::patch('/admin/users/{id}/status', [App\Http\Controllers\AdminController::class, 'updateUserStatus'])->middleware('admin')->name('admin.users.status');

    // Simulations
    Route::post('/simulations', [App\Http\Controllers\SimulationController::class, 'store']);
    Route::get('/mes-simulations/{id}', [App\Http\Controllers\SimulationController::class, 'show'])->name('simulations.show');
    Route::get('/mes-simulations', [App\Http\Controllers\SimulationController::class, 'index']);

    // Messaging routes for web users
    Route::get('/contact/{pro}', [MessageController::class, 'showContactForm'])->name('contact.form');
    Route::post('/contact/{pro}', [MessageController::class, 'sendContactForm'])->name('contact.send');
    Route::get('/messages/{conversation}', [MessageController::class, 'showConversation'])->name('messages.show');
    Route::post('/messages/{conversation}', [MessageController::class, 'replyConversation'])->name('messages.reply');
});
