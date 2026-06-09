<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get a setting by key. Decrypts automatically if encrypted.
     */
    public static function get(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();

        if (!$setting || is_null($setting->value)) {
            return $default;
        }

        // Try to decrypt in case it's an encrypted secret
        try {
            return Crypt::decryptString($setting->value);
        } catch (DecryptException $e) {
            // If it's not encrypted, return the raw value
            return $setting->value;
        }
    }

    /**
     * Set a setting key-value pair. Option to encrypt sensitive values.
     */
    public static function set(string $key, ?string $value, bool $encrypt = false): self
    {
        $storeValue = $value;

        if ($encrypt && !is_null($value)) {
            $storeValue = Crypt::encryptString($value);
        }

        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $storeValue]
        );
    }
}
