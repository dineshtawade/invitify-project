<?php

$path = 'C:\xampp\htdocs\invitify-project\resources\js\pages\reseller\business-cards\edit.tsx';
$content = file_get_contents($path);

// Regex to capture the handlePayment block
// It spans until "window.location.reload(); // Reload to reflect paid status" and the closing brace of try block
$pattern = '/const handlePayment = async \(\) => \{[\s\S]*?window\.location\.reload\(\); \/\/ Reload to reflect paid status\n[\s\S]*?\}\n        \} catch \(err: any\) \{[\s\S]*?\n    \};/';

$newCode = <<<JS
    const handlePayment = async () => {
        if (!cardState.id) return;
        setIsSaving(true);
        setSaveMessage('Purchasing...');
        try {
            // First save any unsaved changes
            await axios.put('/reseller/business-cards/' + cardState.id, cardState);

            const res = await fetch('/reseller/business-cards/' + cardState.id + '/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Purchase failed.');

            setSaveMessage('Payment Successful!');
            window.location.reload();
        } catch (err: any) {
            alert(err.message || 'Payment failed');
            setSaveMessage('');
        } finally {
            setIsSaving(false);
        }
    };
JS;

$content = preg_replace($pattern, $newCode, $content);
file_put_contents($path, $content);
echo "Done edit.tsx.\n";
