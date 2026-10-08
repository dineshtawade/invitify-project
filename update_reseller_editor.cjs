const fs = require('fs');

// Copy customer editor to reseller editor safely
fs.copyFileSync(
    'c:/xampp/htdocs/invitify-project/resources/js/pages/customer/mini-websites/edit.tsx',
    'c:/xampp/htdocs/invitify-project/resources/js/pages/reseller/mini-websites/edit.tsx'
);

let code = fs.readFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/reseller/mini-websites/edit.tsx', 'utf-8');

// 1. Rename Component
code = code.replace(/export default function MiniWebsiteEdit/g, 'export default function ResellerMiniWebsiteEdit');

// 2. Change Props Interface
// We just find the exact block since it's at the top.
const newInterface = `interface PageProps {
    auth: { user: { name: string; email: string; } };
    wallet: { balance: number };
    website: any;
    customBlocks?: any[];
    coupons?: any[];
}`;
code = code.replace(/interface PageProps \{[\s\S]*?\}\s*\}\;/g, newInterface);
code = code.replace(/interface PageProps \{[\s\S]*?\n\}\n/g, newInterface + '\n');

// 3. Update Save endpoint
code = code.replace(/\/customer\/mini-websites\//g, '/reseller/mini-websites/');

// 4. Update breadcrumbs
code = code.replace(/{ title: 'Dashboard', href: '\/customer\/dashboard' }/g, "{ title: 'Reseller Dashboard', href: '/reseller/dashboard' }");
code = code.replace(/{ title: 'My Mini Websites', href: '\/customer\/mini-websites' }/g, "{ title: 'My Hosted Websites', href: '/reseller/websites' }");

// 5. Override handleConfirmRenewal with Reseller logic
// Instead of regex matching the entire function (which is prone to errors), let's find the start of handleConfirmRenewal and the start of the next function.
const startIdx = code.indexOf('const handleConfirmRenewal = async () => {');
const endIdx = code.indexOf('const isExpired =', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
    const resellerLogic = `const handleConfirmRenewal = async () => {
        setIsCheckingOut(true);
        if (!website.is_purchased) {
            router.post(\`/reseller/mini-websites/\${website.uuid || website.id}/purchase-template\`, {}, {
                onSuccess: () => {
                    setIsCheckoutOpen(false);
                    setIsCheckingOut(false);
                    alert('Template license purchased! You can now host the website.');
                },
                onError: () => setIsCheckingOut(false)
            });
        } else {
            router.post(\`/reseller/websites/mini/\${website.id}/host\`, { days: getDaysValue() }, {
                onSuccess: () => {
                    setIsCheckoutOpen(false);
                    setIsCheckingOut(false);
                    window.location.href = \`/mini-website/\${website.slug}\`;
                },
                onError: () => setIsCheckingOut(false)
            });
        }
    };

    `;
    code = code.substring(0, startIdx) + resellerLogic + code.substring(endIdx);
}

// 6. Rewrite the Final Amount Calculation in the modal
code = code.replace(/const templatePrice = !website.is_purchased[\s\S]*?const finalAmount = Math.max\(0, subtotal - discountDeduction\);/, `
    const templatePrice = !website.is_purchased ? website.reseller_price || 0 : 0;
    const dailyPrice = 2; // Flat 2.00 for resellers
    const days = getDaysValue();
    const hostingPrice = website.is_purchased ? days * dailyPrice : 0;
    const finalAmount = templatePrice + hostingPrice;
    const hasSufficientBalance = wallet && wallet.balance >= finalAmount;
`);

// 7. Update Modal UI text
code = code.replace(/<CreditCard className="size-4" \/> {!website.is_purchased \? 'Pay & Publish' : 'Pay & Renew'}/g, `<CreditCard className="size-4" /> {!website.is_purchased ? 'Pay Template Fee' : 'Pay Hosting Fee'}`);

// 8. Add Wallet Balance info
code = code.replace(/<\/DialogFooter>/, `
        {!hasSufficientBalance && (
            <p className="text-red-500 text-xs font-bold text-center mt-2">Insufficient wallet balance! (Available: ₹{wallet?.balance})</p>
        )}
        </DialogFooter>`);

code = code.replace(/disabled={isCheckingOut \|\| finalAmount <= 0}/g, 'disabled={isCheckingOut || finalAmount <= 0 || !hasSufficientBalance}');

fs.writeFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/reseller/mini-websites/edit.tsx', code);
