'use client'
import React, { useEffect, useState } from 'react';
import OptionToggle from './OptionToggle';
import { fetchProfileInformation } from '@/lib/data/firebase/profileInformation';
import { useProfileInformation } from '@/context/ProfileInformationContext';

const ProfileInformation = () => {
    const { setProfileInformation } = useProfileInformation();
    const [profileInformation, setDatasProfileInformation] = useState<ProfileInformation>();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchProfileInformation()
            setDatasProfileInformation(data)
            setProfileInformation(data.fields)
        }
        fetchData()
    }, []);

    return (
        <div className="flex flex-col gap-4 p-4 border mt-4 border-[#EDEDED] rounded-lg">
            <h1 className='text-[#404040] text-sm font-bold'>{profileInformation?.title}</h1>
            <div className="flex flex-col p-2">
                {
                    profileInformation?.fields?.map((field: Field, index) => (
                        <div key={index} className="flex items-center gap-4 border-b last-of-type:border-none border-[#E0E0E0] px-2 py-3">
                            <div className="flex-1">
                                <h1 className='text-[#404040] text-sm'>{field.key}</h1>
                            </div>
                            <OptionToggle validation={field.validation} field={field} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default ProfileInformation;