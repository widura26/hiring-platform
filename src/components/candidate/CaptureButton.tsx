import React from 'react';

const CaptureButton: React.FC<CaptureButtonProps> = ({ setOpenModal }) => {
    return (
        <button onClick={setOpenModal} type="button" className="cursor-pointer mt-2 gap-1 font-bold text-[#1D1F20] text-sm flex items-center justify-center rounded-lg py-2 px-4 border border-[#E0E0E0]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.66699 10.6663L2.66699 11.333C2.66699 12.4376 3.56242 13.333 4.66699 13.333L11.3337 13.333C12.4382 13.333 13.3337 12.4376 13.3337 11.333L13.3337 10.6663M10.667 5.33301L8.00033 2.66634M8.00033 2.66634L5.33366 5.33301M8.00033 2.66634L8.00032 10.6663" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Take a Picture
        </button>
    );
};

export default CaptureButton;