<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'client_id',
        'pro_id',
        'subject',
        'description',
        'phone',
        'status',
        'price',
        'pro_notes',
        'quote_details',
    ];

    protected $casts = [
        'quote_details' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function pro()
    {
        return $this->belongsTo(User::class, 'pro_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'pro_id');
    }
}
