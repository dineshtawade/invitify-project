const fs = require('fs');

const FILE_PATH = 'c:/xampp/htdocs/invitify-project/resources/js/pages/customer/mini-websites/edit.tsx';
let code = fs.readFileSync(FILE_PATH, 'utf-8');

// 1. Add Clock to lucide-react imports
code = code.replace(/Sparkles\n} from 'lucide-react';/, "Sparkles, Clock\n} from 'lucide-react';");

// 2. Add state variables and logic
const stateLogic = `    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutTimeLeft, setCheckoutTimeLeft] = useState(600);

    useEffect(() => {
        let timer;
        if (isCheckoutOpen && checkoutTimeLeft > 0 && !isCheckingOut) {
            timer = setInterval(() => {
                setCheckoutTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isCheckoutOpen && checkoutTimeLeft === 0) {
            setIsCheckoutOpen(false);
            alert("Payment session expired. Please start the payment process again.");
        }
        return () => clearInterval(timer);
    }, [isCheckoutOpen, checkoutTimeLeft, isCheckingOut]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return \`\${m}:\${s}\`;
    };`;
code = code.replace(/const \[isCheckingOut, setIsCheckingOut\] = useState\(false\);/, stateLogic);

// 3. Reset timer in handleBuyClick
code = code.replace(/setIsValidCoupon\(false\);\n\s*setIsCheckoutOpen\(true\);/, `setIsValidCoupon(false);
            setCheckoutTimeLeft(600);
            setIsCheckoutOpen(true);`);

// 4. Inject into UI
const uiLogic = `<DialogHeader className="relative">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
                            <CreditCard className="size-5 text-blue-600" />
                            {!website.is_purchased ? 'Purchase Template & Hosting' : 'Renew Website Hosting'}
                        </DialogTitle>
                        <div className="absolute top-0 right-8 bg-red-100 text-red-700 font-mono text-sm px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-red-200">
                            <Clock className="size-4 animate-pulse" /> {formatTime(checkoutTimeLeft)}
                        </div>
                    </DialogHeader>`;

code = code.replace(/<DialogHeader>\s*<DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">\s*<CreditCard className="size-5 text-blue-600" \/>\s*\{\!website\.is_purchased \? 'Purchase Template & Hosting' : 'Renew Website Hosting'\}\s*<\/DialogTitle>\s*<\/DialogHeader>/, uiLogic);

fs.writeFileSync(FILE_PATH, code);
