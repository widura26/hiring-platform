"use client"
import React, { useEffect } from 'react';
import CheckBox from '../Checkbox';
import useSWR from 'swr';
import { Spinner } from '../Spinner';

interface TableCandidateProps {
  slug: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TableCandidate:React.FC<TableCandidateProps> = ({ slug }) => {

    const { data: candidates, error, isLoading } = useSWR(`/api/jobs/${slug}/candidates`, fetcher, {
        dedupingInterval: 60000,
    });

    useEffect(() => {
        if (candidates) console.log('candidates',candidates)
    }, [candidates])

    if (isLoading) return <div className='flex-1 h-full'><Spinner/></div>;
    if (error) return <div>Error loading jobs</div>;

    return (
        
        <table className='w-full'>
            <thead className='bg-[#FCFCFC] border-b border-[#EDEDED]'>
                <tr className='text-xs font-bold'>
                    <th className='flex items-center gap-2.5 px-4 py-[26px]'>
                        <CheckBox/>
                        <p>NAMA LENGKAP</p>
                    </th>
                    <th className='px-4 py-[26px] text-start'>EMAIL ADDRESS</th>
                    <th className='px-4 py-[26px] text-start'>PHONE NUMBER</th>
                    <th className='px-4 py-[26px] text-start'>DATE OF BIRTH</th>
                    <th className='px-4 py-[26px] text-start'>DOMICILE</th>
                    <th className='px-4 py-[26px] text-start'>GENDER</th>
                    <th className='px-4 py-[26px] text-start'>LINK LINKEDIN</th>
                </tr>
            </thead>
            <tbody className='text-sm text-[#404040]'>
                {
                    candidates.map((candidate:Application, index:number) => (
                        <tr className='border-b border-[#EDEDED]' key={index}>
                            <td className='flex items-center gap-2.5 p-4'>
                                <CheckBox/>
                                <p>{candidate.attributes[0].value}</p>
                            </td>
                            <td className='p-4'>{candidate.attributes[1].value}</td>
                            <td className='p-4'>{candidate.attributes[2].value}</td>
                            <td className='p-4'>{candidate.attributes[3].value}</td>
                            <td className='p-4'>{candidate.attributes[4].value}</td>
                            <td className='p-4'>{candidate.attributes[5].value}</td>
                            <td className='p-4'>{candidate.attributes[6].value}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};

export default TableCandidate;