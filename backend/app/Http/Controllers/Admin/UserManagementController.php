<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    private function authorizeAction($user, string $perm): void
    {
        abort_unless($user && $user->canPermission($perm), 403, 'Forbidden');
    }

    public function index(Request $request)
    {
        $this->authorizeAction($request->user(), 'users:read');
        $users = User::with('role:id,name')->orderBy('id','desc')->get();
        return response()->json($users);
    }

    public function store(Request $request): Response
    {
        $this->authorizeAction($request->user(), 'users:write');
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'username' => ['required','string','max:50','unique:users,username'],
            'email' => ['required','string','email','max:255','unique:users,email'],
            'mobile' => ['nullable','string','max:30'],
            'note' => ['nullable','string'],
            'password' => ['required','confirmed', Rules\Password::defaults()],
            'role_id' => ['nullable','exists:roles,id'],
            'active' => ['boolean'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'mobile' => $data['mobile'] ?? null,
            'note' => $data['note'] ?? null,
            'role_id' => $data['role_id'] ?? null,
            'active' => $data['active'] ?? true,
            'password' => Hash::make($data['password']),
        ]);

        return response()->noContent(201)->setContent($user->toJson());
    }

    public function show(Request $request, User $user)
    {
        $this->authorizeAction($request->user(), 'users:read');
        return response()->json($user->load('role:id,name'));
    }

    public function update(Request $request, User $user): Response
    {
        $this->authorizeAction($request->user(), 'users:modify');
        $data = $request->validate([
            'name' => ['sometimes','string','max:255'],
            'username' => ['sometimes','string','max:50','unique:users,username,'.$user->id],
            'email' => ['sometimes','string','email','max:255','unique:users,email,'.$user->id],
            'mobile' => ['nullable','string','max:30'],
            'note' => ['nullable','string'],
            'password' => ['nullable','confirmed', Rules\Password::defaults()],
            'role_id' => ['nullable','exists:roles,id'],
            'active' => ['boolean'],
        ]);

        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return response()->noContent();
    }

    public function destroy(Request $request, User $user): Response
    {
        $this->authorizeAction($request->user(), 'users:modify');
        $user->delete();
        return response()->noContent();
    }

    // Profile update for current user
    public function updateProfile(Request $request): Response
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['sometimes','string','max:255'],
            'mobile' => ['nullable','string','max:30'],
            'note' => ['nullable','string'],
        ]);
        $user->update($data);
        return response()->noContent();
    }
}
