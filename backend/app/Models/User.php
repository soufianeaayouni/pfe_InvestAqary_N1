<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'phone',
        'email',
        'password',
        'role',
        'city',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function simulations()
    {
        return $this->hasMany(Simulation::class);
    }

    public function professionalProfile()
    {
        return $this->hasOne(ProfessionalProfile::class);
    }

    public function likesSent()
    {
        return $this->belongsToMany(User::class, 'likes', 'user_id', 'pro_id')->withTimestamps();
    }

    public function likesReceived()
    {
        return $this->belongsToMany(User::class, 'likes', 'pro_id', 'user_id')->withTimestamps();
    }

    public function isPro(): bool
    {
        return $this->role === 'pro';
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }
}
