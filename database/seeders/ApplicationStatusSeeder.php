<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicationStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Applied', 'sort_order' => 1],
            ['name' => 'Interviewing', 'sort_order' => 2],
            ['name' => 'Offer', 'sort_order' => 3],
            ['name' => 'Rejected', 'sort_order' => 4],
            ['name' => 'Ghosted', 'sort_order' => 5],
        ];

        DB::table('application_statuses')->insert($statuses);
    }
}
