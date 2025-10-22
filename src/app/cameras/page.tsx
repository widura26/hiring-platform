"use client"
import React, { useRef, useState, useEffect } from 'react';

declare global {
    interface Window {
        Hands: new (config: { locateFile: (file: string) => string }) => MediaPipeHands;
        mediaPipeHandsLoaded?: boolean;
        mediaPipeCameraLoaded?: boolean;
    }
}

const CaptureScreen4 = (props:any) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureCanvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

    const [status, setStatus] = useState('Menunggu...');
    const [handsInstance, setHandsInstance] = useState<MediaPipeHands | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | null>(null);

    const [mode, setMode] = useState<'training' | 'detecting'>('training');
    const [currentTrainingStep, setCurrentTrainingStep] = useState(0);
    const [trainingDataset, setTrainingDataset] = useState<GestureData[]>([]);
    const [currentDetectionStep, setCurrentDetectionStep] = useState(0);
    const [lastDetectedLandmarks, setLastDetectedLandmarks] = useState<Landmark[] | null>(null);
    const [handDetected, setHandDetected] = useState(false);
    const poseHoldTimeRef = useRef(0);
    const isProcessingRef = useRef(false);
    const [enable, setEnable] = useState(false);

    const POSE_NAMES = ["Pose 1", "Pose 2", "Pose 3"];
    const POSE_DESCRIPTIONS = ["1 Jari", "2 Jari", "3 Jari"];

    const loadScript = (src: string, checkFlag: keyof Window): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window[checkFlag]) {
                resolve();
                return;
            }

            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.addEventListener('load', () => {
                    resolve();
                });
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
                resolve();
            };
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    const loadMediaPipeHands = async (): Promise<void> => {
        try {
            setStatus('Memuat MediaPipe...');
            
            await loadScript(
                'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
                'mediaPipeHandsLoaded'
            );
            
            await loadScript(
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
                'mediaPipeCameraLoaded'
            );
      
            await new Promise(resolve => setTimeout(resolve, 300));

            // Load dataset dari localStorage
            loadDatasetFromLocalStorage();

            await initializeCamera();
            await initializeHands();
        } catch (error) {
            console.error('Error loading MediaPipe:', error);
            setStatus('Gagal memuat hand detection');
        }
    };

    const initializeCamera = async (): Promise<void> => {
        try {
            setStatus('Mengakses kamera...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                await new Promise<void>((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play();
                            resolve();
                        };
                    }
                });
          
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setStatus('Gagal mengakses kamera');
        }
    };

    const initializeHands = async (): Promise<void> => {
        try {
            if (!window.Hands) {
                console.error('MediaPipe Hands not loaded');
                setStatus('MediaPipe Hands belum loaded');
                return;
            }

            setStatus('Menginisialisasi hand detection...');
            
            const hands = new window.Hands({
                locateFile: (file: string) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7
            });

            hands.onResults(onHandResults);
            setHandsInstance(hands);
            
            setStatus('Kamera siap! Mode: Training');
       
            if (videoRef.current) {
                const video = videoRef.current;
                const checkVideoReady = () => {
                    if (video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0) {
                        console.log('✅ Video ready, starting detection...');
                        startContinuousDetection(hands);
                    } else {
                        console.log('⏳ Waiting for video...', {
                            readyState: video.readyState,
                            width: video.videoWidth,
                            height: video.videoHeight
                        });
                        setTimeout(checkVideoReady, 200);
                    }
                };
                checkVideoReady();
            }
        } catch (error) {
            console.error('Error initializing hands:', error);
            setStatus('Gagal menginisialisasi hand detection');
        }
    };

    const startContinuousDetection = (hands: MediaPipeHands): void => {
        const detectLoop = async (): Promise<void> => {
            const video = videoRef.current;
            
            if (!video || !hands) {
                animationRef.current = requestAnimationFrame(detectLoop);
                return;
            }

            if (
                !isProcessingRef.current && video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0
            ) {
                isProcessingRef.current = true;
                try {
                    await hands.send({ image: video });
                } catch (error) {
                    console.error('Error sending frame:', error);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                isProcessingRef.current = false;
            }

            animationRef.current = requestAnimationFrame(detectLoop);
        };

        detectLoop();
    };

    const calculateLandmarkDistance = (landmarks1: Landmark[], landmarks2: Landmark[]): number => {
        if (!landmarks1 || !landmarks2 || landmarks1.length !== landmarks2.length) {
            return Infinity;
        }

        let totalDistance = 0;
        for (let i = 0; i < landmarks1.length; i++) {
            const dx = landmarks1[i].x - landmarks2[i].x;
            const dy = landmarks1[i].y - landmarks2[i].y;
            const dz = (landmarks1[i].z || 0) - (landmarks2[i].z || 0);
            totalDistance += Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        return totalDistance / landmarks1.length;
    };

    const matchGesture = (currentLandmarks: Landmark[]): number => {
        if (trainingDataset.length < 3 || !currentLandmarks) return -1;

        let bestMatch = -1;
        let minDistance = Infinity;

        trainingDataset.forEach((data, index) => {
            const distance = calculateLandmarkDistance(currentLandmarks, data.landmarks);
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = index;
            }
        });
        return minDistance < 0.15 ? bestMatch : -1;
    };

    const onHandResults = (results: HandResults): void => {
        if (!overlayCanvasRef.current || !videoRef.current) return;

        const canvas = overlayCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        canvas.width = videoRef.current.videoWidth || 1280;
        canvas.height = videoRef.current.videoHeight || 720;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            setHandDetected(true);
            const landmarks = results.multiHandLandmarks[0];
            setLastDetectedLandmarks(landmarks);
            
            drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height);

            if (mode === 'detecting' && trainingDataset.length === 3) {
                const matchedIndex = matchGesture(landmarks);
                if (matchedIndex === currentDetectionStep) {
                    poseHoldTimeRef.current += 1;
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
                    ctx.font = 'bold 32px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`✅ ${POSE_NAMES[matchedIndex]} Terdeteksi!`, canvas.width / 2, 60);

                    if (poseHoldTimeRef.current > 30) {
                        poseHoldTimeRef.current = 0;
                        
                        if (currentDetectionStep < POSE_NAMES.length - 1) {
                            setCurrentDetectionStep(prev => prev + 1);
                            setStatus(`Bagus! Sekarang tunjukkan ${POSE_NAMES[currentDetectionStep + 1]} (${POSE_DESCRIPTIONS[currentDetectionStep + 1]})`);
                        } else {
                            setStatus('🎉 Semua pose berhasil terdeteksi!');
                            console.log('🎉 Verifikasi selesai!');
                            
                            // Callback ke parent
                            if (props.onVerificationComplete) {
                                setTimeout(() => {
                                    props.onVerificationComplete?.();
                                }, 1000);
                            }
                        }
                    }
                } else {
                    poseHoldTimeRef.current = 0;
                    
                    if (matchedIndex !== -1) {
                        ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';
                        ctx.font = 'bold 28px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(`${POSE_NAMES[matchedIndex]} (Salah pose)`, canvas.width / 2, 60);
                    }
                }
            }
        } else {
            setHandDetected(false);
            setLastDetectedLandmarks(null);
            poseHoldTimeRef.current = 0;
        }
    };
   
    const drawHandLandmarks = ( ctx: CanvasRenderingContext2D, landmarks: Landmark[], width: number, height: number): void => {
        ctx.fillStyle = '#00FF00';
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;

        const connections: [number, number][] = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [5, 9], [9, 10], [10, 11], [11, 12],
            [9, 13], [13, 14], [14, 15], [15, 16],
            [13, 17], [17, 18], [18, 19], [19, 20],
            [0, 17]
        ];

        connections.forEach(([start, end]) => {
            ctx.beginPath();
            ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
            ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
            ctx.stroke();
        });

        landmarks.forEach((landmark, index) => {
            ctx.beginPath();
            const isTip = [4, 8, 12, 16, 20].includes(index);
            const radius = isTip ? 8 : 5;
            ctx.arc(landmark.x * width, landmark.y * height, radius, 0, 2 * Math.PI);
            ctx.fill();
            
            if (isTip) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.strokeStyle = '#00FF00';
                ctx.lineWidth = 3;
            }
        });

        const xs = landmarks.map(p => p.x * width);
        const ys = landmarks.map(p => p.y * height);
        const xMin = Math.min(...xs);
        const xMax = Math.max(...xs);
        const yMin = Math.min(...ys);
        const yMax = Math.max(...ys);

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin);
    };

    const saveDatasetToLocalStorage = (dataset: GestureData[]) => {
        try {
            localStorage.setItem('gestureDataset', JSON.stringify(dataset));
            console.log('✅ Dataset saved to localStorage');
        } catch (error) {
            console.error('Error saving dataset:', error);
        }
    };

    const loadDatasetFromLocalStorage = () => {
        try {
            const saved = localStorage.getItem('gestureDataset');
            if (saved) {
                const dataset = JSON.parse(saved);
                setTrainingDataset(dataset);
                if (dataset.length === 3) {
                    setMode('detecting');
                    setStatus('Dataset loaded! Mode: Detection');
                    console.log('✅ Dataset loaded from localStorage');
                }
            }
        } catch (error) {
            console.error('Error loading dataset:', error);
        }
    };

    useEffect(() => {
        if (enable) {
            loadMediaPipeHands();
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
            if (handsInstance) {
                handsInstance.close();
                setHandsInstance(null);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (handsInstance) {
                handsInstance.close();
            }
        };
    }, [enable]);

    const captureTrainingData = () => {
        if (!lastDetectedLandmarks || !videoRef.current || !captureCanvasRef.current) {
            alert('Mohon tunjukkan tangan Anda terlebih dahulu!');
            console.log('❌ Capture gagal:', {
                hasLandmarks: !!lastDetectedLandmarks,
                hasVideo: !!videoRef.current,
                hasCanvas: !!captureCanvasRef.current
            });
            return;
        }

        console.log('📸 Capturing training data...');

        const canvas = captureCanvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        
        const imageData = canvas.toDataURL('image/png');

        const gestureData: GestureData = {
            poseName: POSE_NAMES[currentTrainingStep],
            landmarks: JSON.parse(JSON.stringify(lastDetectedLandmarks)),
            image: imageData,
            timestamp: Date.now()
        };

        const newDataset = [...trainingDataset, gestureData];
        setTrainingDataset(newDataset);
        setStatus(`${POSE_NAMES[currentTrainingStep]} tersimpan! (${newDataset.length}/3)`);

        // PENTING: Save ke localStorage
        saveDatasetToLocalStorage(newDataset);

        console.log('✅ Dataset updated:', newDataset.length, 'poses');

        if (currentTrainingStep < POSE_NAMES.length - 1) {
            setCurrentTrainingStep(prev => prev + 1);
        } else {
            setTimeout(() => {
                setStatus('Semua pose tersimpan! Siap untuk deteksi.');
            }, 1000);
        }
    };

    const startDetection = () => {
        if (trainingDataset.length < 3) {
            alert('Harap capture semua 3 pose terlebih dahulu!');
            return;
        }
        setMode('detecting');
        setCurrentDetectionStep(0);
        poseHoldTimeRef.current = 0;
        setStatus(`Tunjukkan ${POSE_NAMES[0]} (${POSE_DESCRIPTIONS[0]})`);
    };

    const resetAll = () => {
        setTrainingDataset([]);
        setCurrentTrainingStep(0);
        setCurrentDetectionStep(0);
        setMode('training');
        poseHoldTimeRef.current = 0;
        setStatus('Siap untuk capture dataset baru!');
        localStorage.removeItem('gestureDataset');
    };
   
    const downloadDataset = () => {
        const dataStr = JSON.stringify(trainingDataset, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gesture-dataset-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (props.onFunctionsReady) {
            props.onFunctionsReady({
                captureTrainingData,
                startDetection,
                resetAll,
                downloadDataset,
                trainingDataset,
                mode,
                handDetected,
                currentTrainingStep,
                status
            });
        }
    }, [trainingDataset, mode, handDetected, currentTrainingStep, status]);


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 py-10">
            <form className="bg-white rounded-[10px] shadow-lg w-full flex flex-col max-w-[637px]">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <button 
                            className='bg-[#187cff] rounded-full text-white py-2 px-4 hover:bg-[#1568d6] transition-colors' 
                            type='button' 
                            onClick={() => setEnable(!enable)}
                        >
                            {enable ? '📹 Camera ON' : '📷 Enable Camera'}
                        </button>
                    </div>

                    {enable && mode === 'training' && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                captureTrainingData();
                            }} 
                            disabled={!handDetected}
                            type='button'
                            className='bg-green-600 rounded-full text-white py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors'
                        >
                            📸 Capture {POSE_NAMES[currentTrainingStep]}
                        </button>
                    )}

                    {enable && trainingDataset.length === 3 && mode === 'training' && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                startDetection();
                            }}
                            type='button'
                            className='bg-blue-600 rounded-full text-white py-2 px-4 hover:bg-blue-700 transition-colors'
                        >
                            🎯 Mulai Deteksi
                        </button>
                    )}
                </div>
                <div className="flex flex-col p-6 pt-0 gap-4">
                    <div className="bg-gray-900 rounded-lg overflow-hidden"> 
                        <div className="">
                            <div className='relative w-full h-full'> 
                                <video 
                                    className='w-full h-full' 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline
                                    muted
                                />
                                <canvas 
                                    ref={overlayCanvasRef} 
                                    width={1280}
                                    height={720}
                                    className='absolute inset-0 z-10 w-full h-full' 
                                />
                                <canvas ref={captureCanvasRef} className="hidden" />
                                <canvas ref={canvasRef} className="hidden" />
                                {enable && (
                                    <div className="absolute top-4 left-4 right-4 z-20">
                                        <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                                            <p className="font-bold">{status}</p>
                                            <div className="flex gap-2 mt-1 text-xs">
                                                <span className={`px-2 py-1 rounded ${mode === 'training' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                                    {mode === 'training' ? '📸 Training' : '🎯 Detection'}
                                                </span>
                                                {handDetected && (
                                                    <span className="px-2 py-1 rounded bg-green-500">
                                                        ✓ Hand Detected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {enable && mode === 'training' && (
                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                        <div className="grid grid-cols-3 gap-2">
                                            {POSE_NAMES.map((pose, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-2 rounded text-center font-semibold text-xs ${
                                                        trainingDataset[index]
                                                            ? 'bg-green-500 text-white'
                                                            : currentTrainingStep === index
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-700 bg-opacity-70 text-gray-300'
                                                    }`}
                                                >
                                                    <p>{pose}</p>
                                                    <p className="text-[10px] opacity-80">{POSE_DESCRIPTIONS[index]}</p>
                                                    {trainingDataset[index] && <span>✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className='text-xs leading-5 text-[#1D1F20]'>To take a picture, follow the hand poses in the order shown below. The system will automatically capture the image once the final pose is detected.</p>
                    </div>
                    {enable && trainingDataset.length > 0 && (
                        <div className="flex gap-2">
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadDataset();
                                }}
                                type='button'
                                className='flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-xs hover:bg-purple-700 transition-colors'
                            >
                                💾 Download Dataset
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    resetAll();
                                }}
                                type='button'
                                className='flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-xs hover:bg-red-700 transition-colors'
                            >
                                🔄 Reset
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
       
    );
};

export default CaptureScreen4;