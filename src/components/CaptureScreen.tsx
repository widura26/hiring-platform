import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FilesetResolver, GestureRecognizer, GestureRecognizerResult, DrawingUtils } from '@mediapipe/tasks-vision';

const MODEL_ASSET_PATH = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';
const FINAL_SEQUENCE = [3, 2, 1];

const CaptureScreen = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const drawingUtilsRef = useRef<DrawingUtils | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gestureSequence, setGestureSequence] = useState<number[]>([]);
    const [status, setStatus] = useState('Memuat model...');
    const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null);
    const [lastGesture, setLastGesture] = useState<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            setStatus('Foto berhasil diambil! Mengatur ulang urutan...');
        
            const imageDataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageDataURL;
            link.download = `photo-gesture-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setGestureSequence([]);
            setLastGesture(null);
        }
    }, []);

    const detectAndCapture = useCallback(() => {
        if (!videoRef.current || !gestureRecognizer || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const drawingUtils = drawingUtilsRef.current;
        const nowInMs = performance.now();

        if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
            setStatus('Menunggu video dimuat sepenuhnya...');
            window.requestAnimationFrame(detectAndCapture);
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (drawingUtils) {
            const canvasCtx = canvas.getContext('2d');
            if (canvasCtx) {
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

                let results: GestureRecognizerResult | undefined;

                try {
                    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
                } catch (error) {
                    console.error("Gesture recognition error:", error);
                    results = undefined;
                }
         
                if (results && results.gestures && results.gestures.length > 0) {
                    const gesture = results.gestures[0][0];
                    const gestureName = gesture.categoryName;
                    const fingerCount = getFingerCount(gestureName);

                    if (fingerCount !== null && fingerCount !== lastGesture) {
                        setLastGesture(fingerCount);
                        setGestureSequence(prev => {
                            const newSeq = [...prev, fingerCount];
                            if (newSeq.length > FINAL_SEQUENCE.length) {
                                newSeq.shift();
                            }
                            if (JSON.stringify(newSeq) === JSON.stringify(FINAL_SEQUENCE)) {
                                setTimeout(capturePhoto, 500); // Delay sedikit untuk capture
                            }
                            return newSeq;
                        });
                        setStatus(`Gesture terdeteksi: ${gestureName} (${fingerCount} jari)`);
                    }

                    if (results.landmarks) {
                        for (const landmark of results.landmarks) {
                            drawingUtils.drawConnectors(landmark, GestureRecognizer.HAND_CONNECTIONS, {
                                color: '#00FF00',
                                lineWidth: 5
                            });
                            drawingUtils.drawLandmarks(landmark, {
                                color: '#FF0000',
                                lineWidth: 2
                            });
                        }
                    }
                } else {
                    setStatus('Tidak ada gesture terdeteksi');
                }
            }
        }
        window.requestAnimationFrame(detectAndCapture);
    }, [gestureRecognizer, gestureSequence, capturePhoto]);

    useEffect(() => {
        const initializeMediaPipe = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );
                const recognizer = await GestureRecognizer.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: MODEL_ASSET_PATH,
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    numHands: 2,
                });
                setGestureRecognizer(recognizer);
                setStatus('Model dimuat. Memulai kamera...');
                drawingUtilsRef.current = new DrawingUtils(canvasRef.current!.getContext('2d')!);
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                }
            } catch (error) {
                console.error("Initialization error:", error);
                setStatus('Gagal memuat model atau kamera');
            }
        }    
        initializeMediaPipe();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleVideoLoaded = () => {
        if (gestureRecognizer && videoRef.current) {
            const video = videoRef.current;
            if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
                video.play().then(() => {
                    detectAndCapture();
                }).catch(err => {
                    console.error('Video play failed:', err);
                    setStatus('Gagal memulai video');
                });
            } else {
                setStatus('Menunggu dimensi video...');
            }
        }
    };

    const getFingerCount = (gestureName: string): number => {
        switch (gestureName) {
            case 'Victory':
            case 'I_Love_You':
                return 2;
            case 'Pointing_Up':
                return 1;
            case 'Open_Palm':
                return 3;
            default:
                return 0;
        }
    };

    return (
        <div className='relative w-full h-full'> 
            <video className='w-full h-full' ref={videoRef} onLoadedMetadata={handleVideoLoaded} autoPlay playsInline />
            <canvas 
                ref={canvasRef} 
                width={1280}
                height={720}
                className='absolute inset-0 z-10 w-full h-full' 
            />
        </div>
    );
};

export default CaptureScreen;