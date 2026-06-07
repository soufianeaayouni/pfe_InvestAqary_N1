<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileViewLog extends Model
{
    public $timestamps = false;

    protected $fillable = ['pro_id', 'viewed_at'];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function pro()
    {
        return $this->belongsTo(User::class, 'pro_id');
    }
}
