<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\MiniWebsiteTemplate;
use App\Models\BusinessWebsiteTemplate;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wallet = $user->getOrCreateWallet();

        // Catalog of normal invitation templates
        $templates = Template::all()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
            'price' => floatval($t->price),
            'reseller_price' => $t->getResellerPrice(),
            'bg_gradient' => $t->bg_gradient,
            'thumbnail' => $t->thumbnail,
            'default_config' => $t->default_config,
        ]);

        // Catalog of Mini Website templates
        $miniTemplates = MiniWebsiteTemplate::all()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'type' => $t->type,
            'price' => floatval($t->price),
            'reseller_price' => $t->getResellerPrice(),
            'preview_image' => $t->preview_image,
        ]);

        // Catalog of Business Website templates
        $businessTemplates = BusinessWebsiteTemplate::all()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'price' => floatval($t->price),
            'reseller_price' => $t->getResellerPrice(),
            'preview_image' => $t->preview_image,
            'is_active' => $t->is_active,
        ]);

        return Inertia::render('reseller/shop/index', [
            'wallet' => [
                'balance' => floatval($wallet->balance),
            ],
            'catalog' => [
                'templates' => $templates,
                'miniTemplates' => $miniTemplates,
                'businessTemplates' => $businessTemplates,
            ],
        ]);
    }
}
