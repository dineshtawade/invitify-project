import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Extract icon names, omitting generic lucide components that aren't icons
const iconNames = Object.keys(LucideIcons).filter(
  (name) => name !== 'createLucideIcon' && name !== 'default' && typeof (LucideIcons as any)[name] === 'function'
);

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredIcons = useMemo(() => {
        if (!search) return iconNames.slice(0, 100); // Limit to 100 for performance when no search
        return iconNames.filter(name => name.toLowerCase().includes(search.toLowerCase())).slice(0, 100);
    }, [search]);

    const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.Star;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-8 px-3 rounded-md border border-neutral-200 bg-white text-xs dark:bg-neutral-900 dark:border-neutral-800 w-full justify-between"
            >
                <div className="flex items-center gap-2">
                    <CurrentIcon className="size-4 text-neutral-500" />
                    <span className="truncate">{value || 'Select Icon'}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl p-2">
                    <div className="relative mb-2">
                        <Search className="absolute left-2 top-1.5 size-4 text-neutral-400" />
                        <Input 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Search icons..." 
                            className="h-7 pl-8 text-xs bg-neutral-50 dark:bg-neutral-950" 
                            autoFocus 
                        />
                    </div>
                    <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
                        {filteredIcons.map((name) => {
                            const IconComponent = (LucideIcons as any)[name];
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    title={name}
                                    onClick={() => {
                                        onChange(name);
                                        setIsOpen(false);
                                    }}
                                    className={`p-1.5 flex items-center justify-center rounded hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-neutral-800 transition-colors ${value === name ? 'bg-pink-100 text-pink-700 dark:bg-neutral-800' : 'text-neutral-600 dark:text-neutral-400'}`}
                                >
                                    <IconComponent className="size-4" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* Click away backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
