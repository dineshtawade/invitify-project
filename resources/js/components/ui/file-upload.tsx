import { useState, useRef } from 'react';
import { UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { Input } from './input';

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    placeholder?: string;
    accept?: string;
    className?: string;
}

export function FileUpload({ value, onChange, placeholder = "Enter URL or upload file", accept = "image/*,video/*", className = "" }: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic client-side validation
        if (file.size > 50 * 1024 * 1024) {
            alert('File is too large. Maximum size is 50MB.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch('/media/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Upload failed');
            }

            const data = await response.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (error: any) {
            alert(error.message || 'An error occurred during upload.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input 
                        value={value || ''} 
                        onChange={(e) => onChange(e.target.value)} 
                        placeholder={placeholder}
                        className="pr-8"
                    />
                    {value && (
                        <button 
                            type="button" 
                            onClick={() => onChange('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 bg-white"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
                
                <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 flex items-center justify-center h-10 px-3 border border-neutral-200 rounded-md bg-neutral-50 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                    title="Upload File"
                >
                    {isUploading ? <Loader2 className="size-4 animate-spin text-blue-600" /> : <UploadCloud className="size-4 text-neutral-600" />}
                </button>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept={accept}
                onChange={handleFileChange}
            />
            
            {value && value.startsWith('http') && (
                <div className="mt-1 flex items-center gap-2 p-1 border rounded-md bg-neutral-50 max-w-[200px]">
                    <div className="w-8 h-8 rounded shrink-0 overflow-hidden bg-neutral-200 flex items-center justify-center">
                        {value.match(/\.(mp4|webm)$/i) ? (
                            <div className="text-[8px] font-bold text-neutral-500">VIDEO</div>
                        ) : (
                            <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        )}
                    </div>
                    <span className="text-[10px] text-neutral-500 truncate flex-1" title={value}>{value.split('/').pop()}</span>
                </div>
            )}
        </div>
    );
}
