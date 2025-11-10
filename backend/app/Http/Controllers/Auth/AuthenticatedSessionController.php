<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();

        $user = $request->user();

        // Block sign-in if user is inactive or role is blocked
        if ($user && (!($user->active ?? true) || ($user->role?->is_blocked ?? false) || !($user->role?->active ?? true))) {
            Auth::guard('web')->logout();
            return response()->noContent(423); // Locked
        }

        // Track last logon
        if ($user) {
            $user->forceFill(['last_logon' => now()])->save();
        }

        $request->session()->regenerate();

        return response()->noContent();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
