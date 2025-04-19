import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';

interface DropdownProps {
    label: string;
    items: { href: string; label: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="lg:inline-block hidden relative whitespace-nowrap" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center text-richblack-25 hover:text-[#1ecdf8] py-2 rounded-md text-md"
            >
                {label}
                <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : 'rotate-0'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute bg-black  right-0 mt-2 w-48 shadow-lg rounded-md z-10">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            to={item.href}
                            className="block px-4 py-2 text-white hover:bg-richblack-700"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
