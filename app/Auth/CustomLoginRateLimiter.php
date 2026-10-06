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
        $penaltyKey = $key . ':penalty_level';

        $attempts = $this->limiter->attempts($key);
        
        // 0 -> 1 hour (3600 seconds)
        // 1 -> 1 day (86400 seconds)
        // 2 -> 1 hour, etc.
        $penaltyLevel = Cache::get($penaltyKey, 0);
        $decaySeconds = ($penaltyLevel % 2 == 0) ? 3600 : 86400;

        $this->limiter->hit($key, $decaySeconds);

        // If this hit reaches the 5th attempt, we increment the penalty level for NEXT time they get blocked
        if ($attempts + 1 >= 5) {
            // Keep memory of penalty level for 30 days
            Cache::put($penaltyKey, $penaltyLevel + 1, now()->addDays(30));
        }
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
        
        $penaltyKey = $key . ':penalty_level';
        Cache::forget($penaltyKey);
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
