<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of all users (excluding super admins) with pagination.
     */
    public function index(Request $request)
    {
        $query = User::with([
            'wallet',
            'referralCodes',
            'subscriptions' => function ($q) {
                $q->orderBy('created_at', 'desc');
            }
        ])
        ->withCount([
            'userTemplates as purchased_templates_count' => function ($q) {
                $q->where('is_purchased', true);
            },
            'miniWebsites as mini_websites_count',
            'businessWebsites as business_websites_count'
        ])
        ->where('role', '!=', 'super_admin');

        // Simple search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('super-admin/users', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
            ]
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'role' => 'required|in:editor,reseller,referral_partner,customer',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_approved' => true,
        ]);

        return redirect()->back()->with('status', 'User created successfully.');
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
