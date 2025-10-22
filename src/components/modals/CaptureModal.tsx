"use client"
import CaptureScreen from '@/components/CaptureScreen';
import CaptureScreen2 from '../CaptureScreen2';
import { FilesetResolver, GestureRecognizer, GestureRecognizerResult, DrawingUtils } from '@mediapipe/tasks-vision';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import pose1 from '@/assets/poses/pose1.png'
import pose2 from '@/assets/poses/pose2.png'
import pose3 from '@/assets/poses/pose3.jpg'
import CaptureScreen3 from '../CaptureScreen3';
import CaptureScreen4 from '../CaptureScreen4';


const CaptureModal = (props:CaptureButtonProps) => {
    const [enable, setEnable] = useState(true);    
    
    // const initialize = async () => {
    //     try {            
    //         const vision = await FilesetResolver.forVisionTasks(
    //             "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    //         );
    //         const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    //             baseOptions: {
    //                 modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
    //                 delegate: "GPU"
    //             },
    //             runningMode: "IMAGE",
    //             numHands: 2
    //         });
    //         const image1 = document.getElementById("orangpose") as HTMLImageElement;
    //         const image2 = document.getElementById("pose2") as HTMLImageElement;
    //         const image3 = document.getElementById("pose3") as HTMLImageElement;

    //         if (!image1.complete) await new Promise<void>((r) => (image1.onload = () => r()));
    
    //         const gestureRecognitionResult = gestureRecognizer.recognize(image1);
    
    //         console.log(gestureRecognitionResult)
    //     } catch (error) {
    //         console.error('Something wrong', error)
    //     }
    // }

    // useEffect( () => {
    //     initialize()
    // }, [enable])

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 py-10">
            <form className="bg-white rounded-[10px] shadow-lg w-full flex flex-col max-w-[637px]">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className='font-bold text-[18px]'>Raise Your Hand to Capture</h1>
                        <p className='text-xs'>We’ll take the photo once your hand pose is detected.</p>
                        {/* <button onClick={() => setEnable(true)} type='button' className='bg-[#187cff] cursor-pointer'>Enable Webcam</button> */}
                    </div>
                    <button className='cursor-pointer' type='button' onClick={props.setOpenModal} title='button-close'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col p-6 pt-0 gap-4">
                    <div className="bg-gray-900 rounded-lg overflow-hidden"> 
                        {/* <Image id='orangpose' src={orangposetiga} alt='pose1'/> */}
                        <CaptureScreen4 enable={enable}/>
                    </div>
                    <div>
                        <p className='text-xs leading-5 text-[#1D1F20]'>To take a picture, follow the hand poses in the order shown below. The system will automatically capture the image once the final pose is detected.</p>
                    </div>
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