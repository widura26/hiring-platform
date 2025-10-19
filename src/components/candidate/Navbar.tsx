import React from 'react';

const Navbar = () => {
    return (
        <nav className=' py-3.5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] relative z-10 bg-white '>
            <div className=" flex items-center justify-end gap-4 max-w-[1276px] mx-auto">
                <div className="h-6 bg-[#E0E0E0] w-[1px]"></div>
                <div className="w-7 h-7 bg-black rounded-full"></div>
            </div>
        </nav>
    );
};

export default Navbar;