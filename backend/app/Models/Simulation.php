<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Simulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_type',
        'area',
        'budget_min',
        'budget_max',
        'raw_data',
    ];

    protected $casts = [
        'raw_data' => 'array',
        'area' => 'float',
        'budget_min' => 'float',
        'budget_max' => 'float',
    ];

    /**
     * Get the user that created the simulation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
