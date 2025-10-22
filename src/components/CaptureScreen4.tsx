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
            
            // Load scripts secara berurutan
            await loadScript(
                'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
                'mediaPipeHandsLoaded'
            );
            
            await loadScript(
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
                'mediaPipeCameraLoaded'
            );

            // Tunggu sebentar untuk ensure scripts ready
            await new Promise(resolve => setTimeout(resolve, 300));

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
                
                // Tunggu video ready
                await new Promise<void>((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play();
                            resolve();
                        };
                    }
                });
                
                // Tunggu video benar-benar ready
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
            
            // Tunggu dan pastikan video sudah ready
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

            // Cek video ready dan tidak sedang proses
            if (
                !isProcessingRef.current &&
                video.readyState === 4 &&
                video.videoWidth > 0 &&
                video.videoHeight > 0
            ) {
                isProcessingRef.current = true;
                try {
                    await hands.send({ image: video });
                } catch (error) {
                    console.error('Error sending frame:', error);
                    // Kalau error, tunggu sebentar sebelum coba lagi
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

    const drawHandLandmarks = (
        ctx: CanvasRenderingContext2D,
        landmarks: Landmark[],
        width: number,
        height: number
    ): void => {
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

    useEffect(() => {
        if (props.enable) {
            loadMediaPipeHands();
        } else {
            // Cleanup saat modal ditutup
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
    }, [props.enable]);

    // Capture training data
    const captureTrainingData = () => {
        if (!lastDetectedLandmarks || !videoRef.current || !captureCanvasRef.current) {
            alert('Mohon tunjukkan tangan Anda terlebih dahulu!');
            return;
        }

        const canvas = captureCanvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Flip horizontal
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

        setTrainingDataset(prev => [...prev, gestureData]);
        setStatus(`${POSE_NAMES[currentTrainingStep]} tersimpan! (${trainingDataset.length + 1}/3)`);

        if (currentTrainingStep < POSE_NAMES.length - 1) {
            setCurrentTrainingStep(prev => prev + 1);
        } else {
            setTimeout(() => {
                setStatus('Semua pose tersimpan! Siap untuk deteksi.');
            }, 1000);
        }
    };

    // Mulai mode deteksi
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

    // Reset semua
    const resetAll = () => {
        setTrainingDataset([]);
        setCurrentTrainingStep(0);
        setCurrentDetectionStep(0);
        setMode('training');
        poseHoldTimeRef.current = 0;
        setStatus('Siap untuk capture dataset baru!');
    };

    // Download dataset sebagai JSON
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

    return (
        <>
            <div className="">
                <div className='relative w-full h-full'> 
                    <video 
                        className='w-full h-full' 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                    />
                    <canvas 
                        ref={overlayCanvasRef} 
                        width={1280}
                        height={720}
                        className='absolute inset-0 z-10 w-full h-full' 
                    />
                </div>
            </div>
        </>
    );
};

export default CaptureScreen4;