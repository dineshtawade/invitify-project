<?php

namespace App\Auth;

use Illuminate\Http\Request;
use Laravel\Fortify\LoginRateLimiter;
use Illuminate\Support\Facades\Cache;

class CustomLoginRateLimiter extends LoginRateLimiter
{
    /**
     * Determine if the user has too many failed login attempts.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public function tooManyAttempts(Request $request)
    {
        return $this->limiter->tooManyAttempts($this->throttleKey($request), 5);
    }

    /**
     * Increment the login attempts for the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function increment(Request $request)
    {
        $key = $this->throttleKey($request);
        
        // Block for 5 hours (18000 seconds)
        $decaySeconds = 18000;

        $this->limiter->hit($key, $decaySeconds);
    }

    /**
     * Clear the login locks for the given user credentials.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function clear(Request $request)
    {
        $key = $this->throttleKey($request);
        $this->limiter->clear($key);
    }

    /**
     * Get the throttle key for the given request.
     * We use IP address as requested by the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    protected function throttleKey(Request $request)
    {
        return $request->ip();
    }
}
