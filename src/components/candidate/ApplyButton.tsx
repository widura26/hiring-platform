import Link from 'next/link';
import React from 'react';

const ApplyButton = (props: { slug:string }) => {
    return (
        <Link href={`/candidate/${props.slug}/apply`}>
            <button  type='button' className='cursor-pointer bg-[#FBC037] shadow-[0_1px_2px_rgba(0,0,0,0.12)] text-[#404040] py-1 px-4 rounded-lg text-sm font-bold'>Apply</button>
        </Link>
    );
};

export default ApplyButton;