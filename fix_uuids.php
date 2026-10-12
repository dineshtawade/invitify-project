<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$websites = \App\Models\MiniWebsite::whereNull('uuid')->orWhere('uuid', '')->get();
foreach ($websites as $website) {
    $website->uuid = (string) \Illuminate\Support\Str::uuid();
    $website->save();
}
echo "Fixed " . $websites->count() . " records.\n";
