const fs = require('fs');
let code = fs.readFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/customer/templates/index.tsx', 'utf-8');
code = code.replace("import { Head, Link } from '@inertiajs/react';", "import { Head, Link } from '@inertiajs/react';\nimport MiniWebsitePreview from '@/Components/MiniWebsitePreview';");
code = code.replace(/\)\s*:\s*w\.config\?\.html\s*\?\s*\(/, `) : w.config?.pages ? (
                                                <div className="absolute top-0 left-0 w-full h-[600px] origin-top-left transition-transform duration-500 group-hover:scale-105 bg-white">
                                                    <MiniWebsitePreview config={w.config} />
                                                </div>
                                            ) : w.config?.html ? (`);
fs.writeFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/customer/templates/index.tsx', code);
