<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasApiTokens, HasFactory, Notifiable; // ✅ include HasApiTokens
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'mobile',
        'note',
        'active',
        'last_logon',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
            'last_logon' => 'datetime',
        ];
    }

    public function role()
    {
        return $this->belongsTo(\App\Models\Role::class);
    }

    public function canPermission(string $perm): bool
    {
        $rolePerms = $this->role?->permissions ?? [];
        // Support plain list ['manage-users'] or structured { system: [...], modules: { users: {read:true} } }
        if (is_array($rolePerms)) {
            // module-style check: "module:action"
            if (str_contains($perm, ':')) {
                [$module, $action] = explode(':', $perm, 2);
                $modules = $rolePerms['modules'] ?? [];
                return (bool)($modules[$module][$action] ?? false);
            }
            $system = $rolePerms['system'] ?? $rolePerms; // fall back to flat array
            return in_array($perm, $system, true);
        }
        return false;
    }
}
