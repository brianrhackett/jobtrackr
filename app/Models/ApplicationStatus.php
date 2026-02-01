<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicationStatus extends Model
{
	protected $fillable = [
        'name',
        'sort_order',
    ];

    /**
     * A status has many job applications.
     */
    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'status_id');
    }
}
