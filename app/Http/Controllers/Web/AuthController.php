<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman auth DEMO (visual saja, tanpa backend login beneran).
 * Untuk auth produksi, pasang Laravel Breeze (Inertia) atau Fortify.
 */
class AuthController extends Controller
{
    public function login(): Response
    {
        return Inertia::render('auth/login');
    }

    public function register(): Response
    {
        return Inertia::render('auth/register');
    }

    public function forgotPassword(): Response
    {
        return Inertia::render('auth/forgot-password');
    }

    public function resetPassword(string $token): Response
    {
        return Inertia::render('auth/reset-password', ['token' => $token]);
    }
}
