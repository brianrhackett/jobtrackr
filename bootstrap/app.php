<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);
    })
	->withExceptions(function (Exceptions $exceptions) {
		$exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
			if ($request->expectsJson() || $request->is('api/*')) {
				return response()->json(['message' => 'Unauthenticated.'], 401);
			}

			// For non-API requests you can still send them to your SPA route
			return redirect('/');
		});
    })
    ->create();