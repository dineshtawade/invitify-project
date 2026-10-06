<?php

namespace App\Http\Responses;

use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\LockoutResponse as LockoutResponseContract;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\LoginRateLimiter;

class LoginLockoutResponse implements LockoutResponseContract
{
    /**
     * The login rate limiter instance.
     *
     * @var \Laravel\Fortify\LoginRateLimiter
     */
    protected $limiter;

    /**
     * Create a new response instance.
     *
     * @param  \Laravel\Fortify\LoginRateLimiter  $limiter
     * @return void
     */
    public function __construct(LoginRateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function toResponse($request)
    {
        return with($this->limiter->availableIn($request), function ($seconds) {
            
            // Generate a more user-friendly message including days, hours, minutes if necessary
            if ($seconds > 3600) {
                $days = ceil($seconds / 86400);
                $message = "Too many login attempts. Your IP is blocked for {$days} day(s).";
            } else {
                $minutes = ceil($seconds / 60);
                $message = "Too many login attempts. Your IP is blocked for {$minutes} minute(s).";
            }

            throw ValidationException::withMessages([
                Fortify::username() => [
                    $message
                ],
            ])->status(422); // Use 422 so Inertia correctly handles it as a validation error
        });
    }
}
