const fs = require('fs');
let code = fs.readFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/reseller/mini-websites/edit.tsx', 'utf-8');

// Find the start of interface PageProps
const startIdx = code.indexOf('interface PageProps {');
// Find the start of const pxToCqw
const endIdx = code.indexOf('const pxToCqw = ');

if (startIdx !== -1 && endIdx !== -1) {
    const fixedInterface = `interface PageProps {
    auth: { user: { name: string; email: string; } };
    wallet: { balance: number };
    website: any;
    customBlocks?: any[];
    coupons?: Array<{
        id: number;
        code: string;
        discount: number;
    }>;
}

`;
    code = code.substring(0, startIdx) + fixedInterface + code.substring(endIdx);
    fs.writeFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/reseller/mini-websites/edit.tsx', code);
    console.log("Fixed!");
} else {
    console.log("Not found!");
}
