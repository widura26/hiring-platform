import { useProfileInformation } from '@/context/ProfileInformationContext';
import React, { useEffect, useState } from 'react';

const OptionToggle: React.FC<OptionToggleProps> = ({
  options = ["Mandatory", "Optional", "Off"], value,
  onChange, validation, field
}) => {
    
    const { setProfileInformation } = useProfileInformation();

    const getDefaultValue = () => {
        if (validation.required === true) return "Mandatory";
        if (validation.required === false) return "Optional";
        return "Off";
    };

    const [active, setActive] = useState<string>(value || getDefaultValue());

    useEffect(() => {
        if (validation.required) {
            setActive("Mandatory");
        }
    }, [validation.required]);

    const handleClick = (option: string) => {
        setActive(option);
        onChange?.(option);

        let updatedValidation = { ...field.validation };

        if (option === "Mandatory") updatedValidation.required = true;
        else if (option === "Optional") updatedValidation.required = false;
        else updatedValidation.required = null;

        const updatedField = { ...field, validation: updatedValidation };

        setProfileInformation(prev => {
            const exists = prev.some(item => item.key === field.key);
            if (exists) {
                return prev.map(item => item.key === field.key ? updatedField : item);
            } else {
                return [...prev, updatedField];
            }
        });
    };


    const activeStyle = 'cursor-pointer text-sm text-[#01959F] rounded-full px-3 py-1 border border-[#01959F]'
    const nonActiveStyle = 'cursor-pointer text-sm text-[#404040] rounded-full px-3 py-1 border border-[#E0E0E0]'

    return (
        <div className="flex items-center gap-2 w-fit">
            {
                options.map((option:any, index) => (
                    <button key={index} type="button" disabled={validation.required === true && option !== "Mandatory"} onClick={() => handleClick(option)}
                        className={`${active === option ? activeStyle : nonActiveStyle} ${validation.required && option !== "Mandatory" ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {option}
                        </button>
                ))
            }
        </div>
    );
};

export default OptionToggle;