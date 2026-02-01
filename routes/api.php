<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ApplicationStatusController;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn () => auth()->user());
});

/*
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('job-applications', \App\Http\Controllers\Api\JobApplicationController::class);
});
*/
Route::get('/statuses', [ApplicationStatusController::class, 'index']);
//Route::middleware('auth:sanctum')->get('/statuses', [ApplicationStatusController::class, 'index']);
