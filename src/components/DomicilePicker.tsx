'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface DomicileSelectorProps {
    onSelect?: (value: string) => void;
    placeholder?: string;
    styleInput?: string;
}

export default function DomicilePicker({ onSelect, placeholder = "Choose your domicile", styleInput }: DomicileSelectorProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedDomicile, setSelectedDomicile] = useState<string>('');
    const wrapperRef = useRef<HTMLDivElement>(null);
   
    const domiciles: string[] = [
        'Kabupaten Aceh Barat - Aceh',
        'Kabupaten Aceh Besar - Aceh',
        'Kabupaten Aceh Selatan - Aceh',
        'Kabupaten Aceh Tamiang - Aceh',
        'Kabupaten Aceh Tengah - Aceh',
        'Kabupaten Aceh Tenggara - Aceh',
        'Kabupaten Aceh Utara - Aceh',
        'Kabupaten Badung - Bali',
        'Kabupaten Bangli - Bali',
        'Kabupaten Buleleng - Bali',
        'Kabupaten Gianyar - Bali',
        'Kabupaten Jembrana - Bali',
        'Kabupaten Karangasem - Bali',
        'Kabupaten Klungkung - Bali',
        'Kabupaten Tabanan - Bali',
        'Kota Denpasar - Bali',
    ];
 
    const filteredDomiciles = domiciles.filter(domicile =>
        domicile.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (domicile: string): void => {
        setSelectedDomicile(domicile);
        setSearchQuery('');
        setIsOpen(false);
        onSelect?.(domicile);
    };

    const handleInputClick = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <div className={`flex items-center ${styleInput}`}>
                <input
                    type="text"
                    value={isOpen ? searchQuery : selectedDomicile}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={handleInputClick}
                    placeholder={placeholder}
                    className={`w-full focus:outline-none text-sm`}
                />
            
                <div>
                    <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {
                    filteredDomiciles.length > 0 ? (
                        <ul className="py-2">
                            {filteredDomiciles.map((domicile, index) => (
                            <li key={index}>
                                <button
                                onClick={() => handleSelect(domicile)}
                                className="w-full px-6 py-3 text-left text-xs text-gray-900 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                {domicile}
                                </button>
                            </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-6 py-4 text-gray-500 text-center">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}