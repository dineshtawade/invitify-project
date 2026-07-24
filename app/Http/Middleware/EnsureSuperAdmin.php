<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            abort(403, 'Unauthorized action.');
        }

        if ($user->role === 'editor') {
            if (!$request->routeIs('super-admin.templates*') && 
                !$request->routeIs('mini-website-templates.*') &&
                !$request->routeIs('super-admin.editor-requests.store')) {
                if ($request->routeIs('super-admin.dashboard')) {
                    return redirect()->route('super-admin.templates');
                }
                abort(403, 'Unauthorized action for editor.');
            }
        } elseif ($user->role !== 'super_admin') {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
