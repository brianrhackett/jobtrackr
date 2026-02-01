<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
	protected $fillable = [
        'user_id',
        'company_name',
        'job_title',
        'job_url',
        'location',
        'salary_range',
        'status_id',
        'applied_at',
        'notes',
    ];

    protected $casts = [
        'applied_at' => 'date',
    ];

    /**
     * Job application belongs to a user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Job application belongs to a status.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(ApplicationStatus::class, 'status_id');
    }
}
