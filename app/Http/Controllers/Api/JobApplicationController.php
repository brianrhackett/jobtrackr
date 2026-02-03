<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $apps = JobApplication::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($apps);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
			'company_name' => ['required', 'string', 'max:255'],
			'job_title' => ['required', 'string', 'max:255'],
			'status_id' => ['required', 'integer', 'exists:application_statuses,id'],
			'job_url' => ['nullable', 'string', 'max:2048'],
			'location' => ['nullable', 'string', 'max:255'],
			'salary_range' => ['nullable', 'string', 'max:255'],
			'applied_at' => ['nullable', 'date'],
			'notes' => ['nullable', 'string'],
		]);

        $app = JobApplication::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($app, 201);
    }

    public function show(Request $request, JobApplication $jobApplication)
    {
        $this->authorizeOwner($request, $jobApplication);
        return response()->json($jobApplication);
    }

    public function update(Request $request, JobApplication $jobApplication)
    {
        $this->authorizeOwner($request, $jobApplication);

        $validated = $request->validate([
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'title'   => ['sometimes', 'required', 'string', 'max:255'],
            'status'  => ['sometimes', 'required', 'string', 'max:50'],
            'url'     => ['nullable', 'string', 'max:2048'],
            'notes'   => ['nullable', 'string'],
            'applied_at' => ['nullable', 'date'],
        ]);

        $jobApplication->update($validated);

        return response()->json($jobApplication);
    }

    public function destroy(Request $request, JobApplication $jobApplication)
    {
        $this->authorizeOwner($request, $jobApplication);
        $jobApplication->delete();

        return response()->noContent();
    }

    private function authorizeOwner(Request $request, JobApplication $jobApplication): void
    {
        if ($jobApplication->user_id !== $request->user()->id) {
            abort(403, 'Forbidden');
        }
    }
}
