# JobTrackr – Job Application Tracker

JobTrackr is a full-stack web application built to help users track and manage their job applications in one place. It allows you to log companies, roles, statuses, and notes, and view everything in a clean, searchable dashboard.

This project is built with a Laravel API backend and a React frontend using Vite and Bootstrap.

---

## Tech Stack

- **Backend:** Laravel (PHP)
- **Frontend:** React (Vite)
- **Styling:** Bootstrap 5
- **Authentication:** Laravel Sanctum
- **Database:** MySQL (XAMPP)
- **Dev Tools:** Composer, Node.js, npm

---

## Features (MVP)

- User authentication (register / login / logout)
- Create, edit, delete job applications
- Track application status (Applied, Interviewing, Offer, Rejected, etc.)
- Notes per job
- Dashboard view with filtering and search
- Responsive UI with Bootstrap

---

## Local Development Setup

### Requirements

- PHP 8.1+
- Composer
- Node.js (LTS)
- npm
- XAMPP (Apache + MySQL)

---

### Installation

```bash
git clone https://github.com/brianrhackett/jobtrackr.git
cd jobtrackr
composer install
npm install
cp .env.example .env
php artisan key:generate
