<?php

$path = 'C:\xampp\htdocs\invitify-project\app\Http\Controllers\Reseller\BusinessCardController.php';
$content = file_get_contents($path);

// Replace payOrder
$content = preg_replace('/public function payOrder[\s\S]*?\n    }/', '', $content);

// Replace verifyCardPayment
$content = preg_replace('/public function verifyCardPayment[\s\S]*?\n    }/', '', $content);

$purchaseCode = <<<PHP
    public function purchase(Request \$request, \$id)
    {
        \$card = \App\Models\BusinessCard::where('user_id', auth()->id())->findOrFail(\$id);
        \$user = auth()->user();
        \$wallet = \$user->wallet;

        if (!\$wallet) {
            return response()->json(['error' => 'Wallet not found'], 400);
        }

        \$plan = \$card->plan;
        \$price = floatval(\$plan->reseller_price) > 0 ? floatval(\$plan->reseller_price) : floatval(\$plan->price);

        if (\$wallet->balance < \$price) {
            return response()->json(['error' => 'Insufficient wallet balance'], 400);
        }

        \Illuminate\Support\Facades\DB::transaction(function () use (\$card, \$user, \$wallet, \$price) {
            \$card->update([
                'payment_status'  => 'Success',
                'status'          => 'active',
                'plan_expires_at' => now()->addMonths(\$card->plan->duration_months),
            ]);

            \$transaction = \App\Models\Transaction::create([
                'user_id'          => \$user->id,
                'business_card_id' => \$card->id,
                'amount'           => \$price,
                'status'           => 'completed',
                'payment_method'   => 'wallet',
            ]);

            \$wallet->debit(\$price, "Purchased Business Card: " . \$card->company_name, \$transaction);
        });

        return response()->json(['success' => true]);
    }
PHP;

$content = str_replace('private function getTemplatesList()', $purchaseCode . "\n\n    private function getTemplatesList()", $content);

file_put_contents($path, $content);
echo "Done.\n";
