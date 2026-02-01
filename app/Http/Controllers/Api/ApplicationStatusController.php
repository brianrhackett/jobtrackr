<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationStatus;
use Illuminate\Http\JsonResponse;

class ApplicationStatusController extends Controller
{
    /**
     * Return all application statuses.
     */
    public function index(): JsonResponse
    {
        $statuses = ApplicationStatus::orderBy('sort_order')->get();

        return response()->json($statuses);
    }
}