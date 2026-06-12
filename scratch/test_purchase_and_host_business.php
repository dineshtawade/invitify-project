<?php

require 'c:/xampp/htdocs/Invitify-new/vendor/autoload.php';
$app = require_once 'c:/xampp/htdocs/Invitify-new/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BusinessWebsite;

$site = BusinessWebsite::find(1);

if (!$site) {
    echo "Site ID 1 not found.\n";
    exit(1);
}

echo "BEFORE HOSTING SIMULATION:\n";
echo "=========================\n";
echo "Site ID: " . $site->id . "\n";
echo "Is Published: " . ($site->is_published ? 'YES' : 'NO') . "\n";
echo "Is Purchased: " . ($site->is_purchased ? 'YES' : 'NO') . "\n";
echo "Expires At: " . ($site->expires_at ? $site->expires_at->toDateTimeString() : 'NULL') . "\n";
echo "Is Subscription Expired: " . ($site->isSubscriptionExpired() ? 'YES' : 'NO') . "\n\n";

// Simulate hosting purchase of 30 days
$days = 30;
$baseDate = ($site->expires_at && $site->expires_at->isFuture()) ? $site->expires_at : now();
$site->expires_at = $baseDate->copy()->addDays($days);
$site->is_published = true;
$site->save();

// Reload model
$site->refresh();

echo "AFTER HOSTING SIMULATION:\n";
echo "========================\n";
echo "Site ID: " . $site->id . "\n";
echo "Is Published: " . ($site->is_published ? 'YES' : 'NO') . "\n";
echo "Is Purchased: " . ($site->is_purchased ? 'YES' : 'NO') . "\n";
echo "Expires At: " . ($site->expires_at ? $site->expires_at->toDateTimeString() : 'NULL') . "\n";
echo "Is Subscription Expired: " . ($site->isSubscriptionExpired() ? 'YES' : 'NO') . "\n";
