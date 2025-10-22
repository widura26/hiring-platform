import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FilesetResolver, GestureRecognizer, GestureRecognizerResult, DrawingUtils } from '@mediapipe/tasks-vision';

const MODEL_ASSET_PATH = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';

const CaptureScreen3 = (props:any) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingUtilsRef = useRef<DrawingUtils | null>(null);
    const [status, setStatus] = useState('Menunggu...');
    const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const FINAL_SEQUENCE = ["Victory", "Thumb_Up", "Open_Palm"];
    const [currentStep, setCurrentStep] = useState(0);

    const initialize = async () => {
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

    useEffect(() => {
        if(props.enable){
            initialize();
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        }
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [props.enable]);

    useEffect(() => {
        if (!gestureRecognizer) return;

        const processFrame = async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                requestAnimationFrame(processFrame);
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const result = gestureRecognizer.recognizeForVideo(video, performance.now());

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (result.landmarks && result.landmarks.length > 0) {
                const drawingUtils = new DrawingUtils(ctx);

                result.landmarks.forEach((landmarkList, i) => {
                
                    drawingUtils.drawConnectors(landmarkList, GestureRecognizer.HAND_CONNECTIONS, {
                        color: '#00FF00',
                        lineWidth: 2,
                    });
                    drawingUtils.drawLandmarks(landmarkList, { color: '#FF0000', lineWidth: 1 });
               
                    const xs = landmarkList.map((p) => p.x * canvas.width);
                    const ys = landmarkList.map((p) => p.y * canvas.height);
                    const xMin = Math.min(...xs);
                    const xMax = Math.max(...xs);
                    const yMin = Math.min(...ys);
                    const yMax = Math.max(...ys);
                    const boxWidth = xMax - xMin;
                    const boxHeight = yMax - yMin;

                    if (boxWidth > 0 && boxHeight > 0) {
                        ctx.strokeStyle = '#00FF00';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(xMin, yMin, boxWidth, boxHeight);
                    }

                    const gestureName = result.gestures?.[i]?.[0]?.categoryName || "Unknown";
                    if (gestureName === FINAL_SEQUENCE[currentStep]) {
                        console.log(`✅ Pose ${gestureName} benar!`);
                        setCurrentStep((prev) => prev + 1);
                    }
               
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                    ctx.font = '20px sans-serif';
                    ctx.fillText(gestureName, xMin, yMin - 10);
                });
            }

            if (currentStep >= FINAL_SEQUENCE.length) {
                console.log("🎉 Verifikasi selesai!");
                setStatus("Verifikasi selesai ✅");
                return;
            }

            requestAnimationFrame(processFrame);
        };

        processFrame();
    }, [gestureRecognizer]);

    return (
        <>
            <div className="">
                <div className='relative w-full h-full'> 
                    <video className='w-full h-full' ref={videoRef} autoPlay playsInline />
                    <canvas 
                        ref={canvasRef} 
                        width={1280}
                        height={720}
                        className='absolute inset-0 z-10 w-full h-full' 
                    />
                </div>
            </div>
        </>
    );
};

export default CaptureScreen3;