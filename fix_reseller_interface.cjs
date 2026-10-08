const fs = require('fs');
const lines = fs.readFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/reseller/mini-websites/edit.tsx', 'utf8').split('\n');

const fixedInterface = `interface PageProps {
    auth: { user: { name: string; email: string; } };
    wallet: { balance: number };
    website: any;
    customBlocks?: any[];
    coupons?: any[];
}`;

lines.splice(26, 1, fixedInterface); // Replace the mangled line 27 which has all the \\n

fs.writeFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/reseller/mini-websites/edit.tsx', lines.join('\n'));
