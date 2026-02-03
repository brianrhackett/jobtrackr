<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationStatus;

class ApplicationStatusController extends Controller
{
    public function index()
    {
        // Adjust column names here if your status table uses different ones
        return response()->json(
            ApplicationStatus::query()
                ->select(['id', 'name'])   // if your column is called something else, change it
                ->orderBy('id')
                ->get()
        );
    }
}
