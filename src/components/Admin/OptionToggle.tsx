import React, { useState } from 'react';

const OptionToggle: React.FC<OptionToggleProps> = ({
  options = ["Mandatory", "Optional", "Off"],
  value,
  onChange,
}) => {

    const [active, setActive] = useState<string>(value || options[0]);

    const handleClick = (option: string) => {
        setActive(option);
        onChange?.(option);
    };


    const activeStyle = 'cursor-pointer text-sm text-[#01959F] rounded-full px-3 py-1 border border-[#01959F]'
    const nonActiveStyle = 'cursor-pointer text-sm text-[#404040] rounded-full px-3 py-1 border border-[#E0E0E0]'

    return (
        <div className="flex items-center gap-2 w-fit">
            {
                options.map((option:any, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(option)}
                        className={active === option ? activeStyle : nonActiveStyle}
                    >{option}</button>
                ))
            }
        </div>
    );
};

export default OptionToggle;