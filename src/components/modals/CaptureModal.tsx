"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import pose1 from '@/assets/poses/pose1.png'
import pose2 from '@/assets/poses/pose2.png'
import pose3 from '@/assets/poses/pose3.jpg'
import CaptureScreen4 from '../CaptureScreen4';
import CaptureScreen5 from '../CaptureScreen5';


const CaptureModal = (props:CaptureButtonProps) => {
    const [enable, setEnable] = useState(true);    

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 py-10">
            <form className="bg-white rounded-[10px] shadow-lg w-full flex flex-col max-w-[637px]">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className='font-bold text-[18px]'>Raise Your Hand to Capture</h1>
                        <p className='text-xs'>We’ll take the photo once your hand pose is detected.</p>
                    </div>
                    <button className='cursor-pointer' type='button' onClick={props.setOpenModal} title='button-close'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col p-6 pt-0 gap-4">
                    <div className="bg-gray-900 h-[350px] rounded-lg overflow-hidden"> 
                        <CaptureScreen4/>
                    </div>
                    <div>
                        <p className='text-xs leading-5 text-[#1D1F20]'>To take a picture, follow the hand poses in the order shown below. The system will automatically capture the image once the final pose is detected.</p>
                    </div>
                    {/* {mode === 'training' && (
                        <button onClick={captureTrainingData} disabled={!handDetected}>
                        Capture {POSE_NAMES[currentTrainingStep]}
                        </button>
                    )}
                    {trainingDataset.length === 3 && mode === 'training' && (
                        <button onClick={startDetection}>
                        Mulai Deteksi
                        </button>
                    )} */}
                    <div className="flex items-center justify-center gap-2">
                        <Image id='pose1' src={pose1} width={50} height={50} alt='pose1'/>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.87207 5.62891L16.8721 12.6289L9.87207 19.6289" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <Image id='pose2' src={pose2} width={50} height={50} alt='pose2'/>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.87207 5.62891L16.8721 12.6289L9.87207 19.6289" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <Image id='pose3' src={pose3} width={50} height={50} alt='pose3'/>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CaptureModal;