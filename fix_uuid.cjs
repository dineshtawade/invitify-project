const fs = require('fs');
let code = fs.readFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/customer/mini-websites/index.tsx', 'utf-8');

// The parameter for handleDelete should be string | number instead of number
code = code.replace(/handleDelete = \(id: number\)/, "handleDelete = (id: string | number)");

// The parameter for handleDownloadZip should be string | number instead of number
code = code.replace(/handleDownloadZip = async \(websiteId: number\)/, "handleDownloadZip = async (websiteId: string | number)");

// Replacing the links:
code = code.replace(/\/customer\/mini-websites\/\$\{w\.id\}\/edit/g, "/customer/mini-websites/${w.uuid || w.id}/edit");
code = code.replace(/\/customer\/mini-websites\/\$\{w\.id\}\/submissions/g, "/customer/mini-websites/${w.uuid || w.id}/submissions");
code = code.replace(/handleDelete\(w\.id\)/g, "handleDelete(w.uuid || w.id)");
code = code.replace(/handleDownloadZip\(w\.id\)/g, "handleDownloadZip(w.uuid || w.id)");

fs.writeFileSync('c:/xampp/htdocs/invitify-project/resources/js/pages/customer/mini-websites/index.tsx', code);
