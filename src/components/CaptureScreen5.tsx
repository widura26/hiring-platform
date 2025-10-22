import React, { useRef, useState, useEffect } from 'react';

declare global {
  interface Window {
    Hands: new (config: { locateFile: (file: string) => string }) => MediaPipeHands;
    mediaPipeHandsLoaded?: boolean;
    mediaPipeCameraLoaded?: boolean;
  }
}

const CaptureScreen5 = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState('Menunggu...');
  const [handsInstance, setHandsInstance] = useState<MediaPipeHands | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const [handDetected, setHandDetected] = useState(false);
  const [lastDetectedLandmarks, setLastDetectedLandmarks] = useState<Landmark[] | null>(null);
  const poseHoldTimeRef = useRef(0);
  const isProcessingRef = useRef(false);

  const loadScript = (src: string, checkFlag: keyof Window): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window[checkFlag]) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const loadMediaPipeHands = async (): Promise<void> => {
    try {
      setStatus('Memuat MediaPipe...');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js', 'mediaPipeHandsLoaded');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js', 'mediaPipeCameraLoaded');
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
    if (!window.Hands) {
      setStatus('MediaPipe Hands belum loaded');
      return;
    }

    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults(onHandResults);
    setHandsInstance(hands);

    setStatus('Kamera siap! Tunjukkan 3 jari untuk trigger foto 📸');

    if (videoRef.current) {
      const video = videoRef.current;
      const checkVideoReady = () => {
        if (video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0) {
          startContinuousDetection(hands);
        } else {
          setTimeout(checkVideoReady, 200);
        }
      };
      checkVideoReady();
    }
  };

  const startContinuousDetection = (hands: MediaPipeHands): void => {
    const detectLoop = async (): Promise<void> => {
      const video = videoRef.current;
      if (!video || !hands) {
        animationRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      if (!isProcessingRef.current && video.readyState === 4) {
        isProcessingRef.current = true;
        try {
          await hands.send({ image: video });
        } catch (error) {
          console.error('Error sending frame:', error);
        }
        isProcessingRef.current = false;
      }
      animationRef.current = requestAnimationFrame(detectLoop);
    };
    detectLoop();
  };

    let prevFingerCount = 0;
    let stableFrameCount = 0;

    function countFingers(landmarks: any[]) {
        if (!landmarks || landmarks.length === 0) return 0;

        const thumbTip = landmarks[4];
        const thumbBase = landmarks[2];
    
        const fingerTips = [8, 12, 16, 20];
        const fingerPIPs = [6, 10, 14, 18];

        let fingerCount = 0;

        // Deteksi tangan kanan atau kiri
        const isRightHand = landmarks[17].x < landmarks[5].x;

        // === Thumb detection ===
        if (isRightHand) {
            if (thumbTip.x < thumbBase.x - 0.02) fingerCount++;
        } else {
            if (thumbTip.x > thumbBase.x + 0.02) fingerCount++;
        }

        // === 4 fingers ===
        fingerTips.forEach((tipIdx, i) => {
            const pipIdx = fingerPIPs[i];
            const tip = landmarks[tipIdx];
            const pip = landmarks[pipIdx];
            if (tip.y < pip.y - 0.02) fingerCount++;
        });

        // === Stabilizer ===
        let finalCount = prevFingerCount;
        if (fingerCount === prevFingerCount) {
            stableFrameCount++;
            if (stableFrameCount >= 3) {
            finalCount = fingerCount;
            }
        } else {
            stableFrameCount = 0;
        }

        prevFingerCount = fingerCount;
        return finalCount;
    }


    const onHandResults = (results: HandResults): void => {
        if (!overlayCanvasRef.current || !videoRef.current) return;

        const canvas = overlayCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            setHandDetected(true);
            const landmarks = results.multiHandLandmarks[0];
            setLastDetectedLandmarks(landmarks);
            drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height);

            const fingerCount = countFingers(landmarks);
            ctx.fillStyle = 'black';
            ctx.font = 'bold 32px Arial';
            ctx.fillText(`Jari terbuka: ${fingerCount}`, canvas.width / 2, 60);
            
            if (fingerCount === 3) {
                poseHoldTimeRef.current++;
                if (poseHoldTimeRef.current > 20) { // ~ 0.5 detik
                    takePhoto();
                    poseHoldTimeRef.current = 0;
                }
            } else {
                poseHoldTimeRef.current = 0;
            }
        } else {
            setHandDetected(false);
            setLastDetectedLandmarks(null);
            poseHoldTimeRef.current = 0;
        }
    };

    const takePhoto = () => {
        if (!videoRef.current || !captureCanvasRef.current) return;

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
        setStatus('📸 Foto diambil!');
        console.log('Photo captured:', imageData);
    };

    const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: Landmark[], width: number, height: number): void => {
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

        landmarks.forEach((landmark) => {
        ctx.beginPath();
        ctx.arc(landmark.x * width, landmark.y * height, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
        });
    };

    useEffect(() => {
        loadMediaPipeHands();
        return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        if (handsInstance) handsInstance.close();
        };
    }, []);

    return (
        <>
        <div className="relative w-full h-full">
            <video className='w-full h-[350px]' ref={videoRef} autoPlay playsInline />
            <canvas ref={overlayCanvasRef} className='absolute inset-0 z-10 w-full h-full' />
        </div>
        </>
    );
};

export default CaptureScreen5;
