const fs = require('fs');
let code = fs.readFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/super-admin/mini-website-templates/index.tsx', 'utf-8');

// 1. Add import
if (!code.includes('import MiniWebsitePreview')) {
    code = code.replace("import { Head, Link, router } from '@inertiajs/react';", "import { Head, Link, router } from '@inertiajs/react';\nimport MiniWebsitePreview from '@/Components/MiniWebsitePreview';");
}

// 2. Replace the simple Globe with the robust preview logic
const target = `<Globe className="size-4.5 text-pink-600" /> {t.name}`;
const replacement = `{t.preview_image ? (
                                                    <img src={t.preview_image} alt={t.name} className="size-10 rounded-md object-cover border border-neutral-200" />
                                                ) : t.default_config?.pages ? (
                                                    <div className="size-10 rounded-md overflow-hidden border border-neutral-200 relative bg-white shrink-0">
                                                        <div className="absolute top-0 left-0 w-[40px] h-[600px] origin-top-left pointer-events-none">
                                                            <MiniWebsitePreview config={t.default_config} />
                                                        </div>
                                                    </div>
                                                ) : t.default_config?.html ? (
                                                    <div className="size-10 rounded-md overflow-hidden border border-neutral-200 relative bg-white shrink-0">
                                                        <div className="absolute inset-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none">
                                                            <iframe srcDoc={t.default_config.html} className="w-full h-full border-none pointer-events-none bg-white" tabIndex={-1} scrolling="no" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="size-10 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 flex items-center justify-center shrink-0">
                                                        <Globe className="size-5 text-neutral-400" />
                                                    </div>
                                                )} {t.name}`;

code = code.replace(target, replacement);

fs.writeFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/super-admin/mini-website-templates/index.tsx', code);
