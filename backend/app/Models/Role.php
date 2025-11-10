<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'permissions',
        'is_blocked',
        'blocked_until',
        'active',
        'note',
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_blocked' => 'boolean',
        'blocked_until' => 'datetime',
        'active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
