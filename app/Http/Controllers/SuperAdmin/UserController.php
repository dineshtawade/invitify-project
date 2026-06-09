<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of all users (excluding super admins).
     */
    public function index()
    {
        $users = User::where('role', '!=', 'super_admin')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('super-admin/users', [
            'users' => $users,
        ]);
    }

    /**
     * Approve a pending user.
     */
    public function approve(User $user)
    {
        $user->is_approved = true;
        $user->save();

        return redirect()->back()->with('status', "User {$user->name} has been approved.");
    }
}
