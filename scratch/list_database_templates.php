<?php

require 'c:/xampp/htdocs/Invitify-new/vendor/autoload.php';
$app = require_once 'c:/xampp/htdocs/Invitify-new/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Template;
use App\Models\MiniWebsiteTemplate;
use App\Models\BusinessWebsiteTemplate;

echo "--- Invitation Cards & Videos  (Template) ---\n";
foreach (Template::all() as $t) {
    echo "ID: {$t->id} | Name: {$t->name} | Price: {$t->price}\n";
}

echo "\n--- Invitation Website (MiniWebsiteTemplate) ---\n";
foreach (MiniWebsiteTemplate::all() as $t) {
    echo "ID: {$t->id} | Name: {$t->name} | Type: {$t->type} | Price: {$t->price}\n";
}

echo "\n--- BUSINESS WEBSITES (BusinessWebsiteTemplate) ---\n";
foreach (BusinessWebsiteTemplate::all() as $t) {
    echo "ID: {$t->id} | Name: {$t->name} | Price: {$t->price}\n";
}
