<?php

require 'c:/xampp/htdocs/Invitify-new/vendor/autoload.php';
$app = require_once 'c:/xampp/htdocs/Invitify-new/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BusinessWebsite;

$site = BusinessWebsite::find(1);
if ($site) {
    $site->expires_at = null;
    $site->save();
    echo "Reverted Site ID 1 hosting to NULL (expired).\n";
} else {
    echo "Site ID 1 not found.\n";
}
