<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserManagementController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user()->load('role');
});

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Roles
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::patch('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);

    // Users
    Route::get('/users', [UserManagementController::class, 'index']);
    Route::post('/users', [UserManagementController::class, 'store']);
    Route::get('/users/{user}', [UserManagementController::class, 'show']);
    Route::patch('/users/{user}', [UserManagementController::class, 'update']);
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy']);

    // Profile
    Route::patch('/me', [UserManagementController::class, 'updateProfile']);
});
