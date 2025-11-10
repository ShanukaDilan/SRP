<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeAction($request->user(), 'roles:read');
        return response()->json(Role::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeAction($request->user(), 'roles:write');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:roles,name'],
            'permissions' => ['nullable','array'], // { system:[], modules:{ users:{read:true,write:false,modify:false} } }
            'is_blocked' => ['boolean'],
            'blocked_until' => ['nullable', 'date'],
            'active' => ['boolean'],
            'note' => ['nullable','string'],
        ]);
        $role = Role::create($data);
        return response()->json($role, 201);
    }

    public function show(Request $request, Role $role)
    {
        $this->authorizeAction($request->user(), 'roles:modify');
        return response()->json($role);
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        $this->authorizeAction($request->user(), 'roles:modify');
        $data = $request->validate([
            'name' => ['sometimes','string','max:100','unique:roles,name,'.$role->id],
            'permissions' => ['sometimes','array'],
            'is_blocked' => ['sometimes','boolean'],
            'blocked_until' => ['nullable','date'],
            'active' => ['sometimes','boolean'],
            'note' => ['nullable','string'],
        ]);
        $role->update($data);
        return response()->json($role->fresh());
    }

    public function destroy(Request $request, Role $role): Response
    {
        $this->authorizeAction($request->user(), 'manage-roles');
        $role->delete();
        return response()->noContent();
    }

    private function authorizeAction($user, string $perm): void
    {
        abort_unless($user && $user->canPermission($perm), 403, 'Forbidden');
    }
}
