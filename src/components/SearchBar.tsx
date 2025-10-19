import React from 'react';

const SearchBar = (props:any) => {
    return (
        <div className="pt-9 px-6">
            <input type="text" title="search-bar" className="focus:outline-none w-full border-[2px] text-sm border-[#EDEDED] rounded-[8px] text-[#757575] px-4 py-2.5" placeholder="Search by job details" />
        </div>
    );
};

export default SearchBar;