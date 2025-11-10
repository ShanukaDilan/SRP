<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'Administrator'],
            [
                'permissions' => [
                    'system' => ['manage-users','manage-roles'],
                    'modules' => [
                        'users' => ['read' => true, 'write' => true, 'modify' => true],
                        'roles' => ['read' => true, 'write' => true, 'modify' => true],
                    ],
                ],
                'is_blocked' => false,
                'active' => true,
            ]
        );

        // Create a default admin user for testing
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );
        $user->role()->associate($adminRole);
        $user->active = true;
        $user->save();
    }
}
