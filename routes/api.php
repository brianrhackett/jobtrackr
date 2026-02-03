<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ApplicationStatusController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobApplicationController;

Route::middleware(['web'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::apiResource('applications', JobApplicationController::class)
        ->parameters(['applications' => 'jobApplication']);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/application-statuses', [ApplicationStatusController::class, 'index']);
});
