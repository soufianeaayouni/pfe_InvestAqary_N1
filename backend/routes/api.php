<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SimulationController;
use App\Http\Controllers\ProfessionalController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LikeController;
use App\Http\Middleware\OptionalSanctumAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/register/client', [AuthController::class, 'registerClient']);
    Route::post('/register/pro', [AuthController::class, 'registerPro']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/professionals', [ProfessionalController::class, 'index']);
Route::get('/professionals/{id}', [ProfessionalController::class, 'show']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/professionals/{proId}/reviews', [ReviewController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => $user->role === 'pro' ? $user->load('professionalProfile') : $user,
        ]);
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::put('/professional/profile', [ProfessionalController::class, 'update']);
    Route::get('/pro/stats', [ProfessionalController::class, 'stats']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::get('/simulations', [SimulationController::class, 'index']);
    Route::put('/simulations/{id}', [SimulationController::class, 'update']);
    Route::patch('/simulations/{id}', [SimulationController::class, 'update']);
    Route::delete('/simulations/{id}', [SimulationController::class, 'destroy']);
    
    // Likes
    Route::post('/professionals/{id}/like', [LikeController::class, 'toggleLike']);
    Route::get('/likes', [LikeController::class, 'getMyLikes']);
    Route::get('/pro/likes-received', [LikeController::class, 'getLikesReceived']);
    
    Route::get('/leads', [LeadController::class, 'index']);
    Route::post('/leads', [LeadController::class, 'store']);
    Route::put('/leads/{id}', [LeadController::class, 'update']);
    Route::post('/leads/{id}/status', [LeadController::class, 'updateStatus']);
    Route::delete('/leads/{id}', [LeadController::class, 'destroy']);
    
    Route::post('/reviews', [ReviewController::class, 'store']);
    
    // Messaging Routes
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::get('/conversations/{id}/messages', [MessageController::class, 'messages']);
    Route::post('/messages', [MessageController::class, 'sendMessage']);
    
    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::post('/users/{id}/toggle-verification', [AdminController::class, 'toggleUserVerification']);
        Route::get('/simulations', [AdminController::class, 'simulations']);
        Route::delete('/simulations/{id}', [AdminController::class, 'deleteSimulation']);
        Route::get('/projects', [AdminController::class, 'projects']);
        Route::post('/projects/{id}/toggle', [AdminController::class, 'toggleProjectStatus']);
        Route::delete('/projects/{id}', [AdminController::class, 'deleteProject']);

        Route::get('/products', [AdminController::class, 'products']);
        Route::post('/products/{id}/toggle', [AdminController::class, 'toggleProductStatus']);
        Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);
    });
});

Route::middleware([OptionalSanctumAuth::class])->group(function () {
    Route::post('/simulations', [SimulationController::class, 'store']);
    Route::get('/simulations/{id}', [SimulationController::class, 'show']);
});
