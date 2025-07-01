
import React, { useEffect, useRef, useState } from 'react';
import { useCameraContext } from '../contexts/CameraContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, Download } from 'lucide-react';

interface CameraFeedProps {
    feedId: string;
    title?: string;
    width?: number;
    height?: number;
    showControls?: boolean;
    applyFilter?: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
    feedId,
    title = 'Camera Feed',
    width = 320,
    height = 240,
    showControls = true,
    applyFilter = false
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const {
        activeStream,
        isLoading,
        error,
        startCamera,
        stopCamera,
        createStreamClone
    } = useCameraContext();

    useEffect(() => {
        if (activeStream && videoRef.current) {
            // Use cloned stream to allow multiple video elements
            const clonedStream = activeStream.clone();
            videoRef.current.srcObject = clonedStream;
            console.log(`Feed ${feedId} connected to camera stream`);

            // Apply canvas filter if requested
            if (applyFilter && canvasRef.current) {
                applyCanvasFilter();
            }
        }
    }, [activeStream, feedId, applyFilter]);

    const applyCanvasFilter = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        const drawFrame = () => {
            if (video.paused || video.ended) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the video frame
            ctx?.drawImage(video, 0, 0);

            // Apply a simple filter (grayscale in this example)
            if (ctx) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = gray;     // Red
                    data[i + 1] = gray; // Green
                    data[i + 2] = gray; // Blue
                }

                ctx.putImageData(imageData, 0, 0);
            }

            requestAnimationFrame(drawFrame);
        };

        video.addEventListener('play', drawFrame);
    };

    const startRecording = () => {
        if (!activeStream) return;

        try {
            const mediaRecorder = new MediaRecorder(activeStream);
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                setRecordedChunks(chunks);
                console.log('Recording stopped, chunks:', chunks.length);
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            console.log('Recording started for feed:', feedId);
        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log('Recording stopped for feed:', feedId);
        }
    };

    const downloadRecording = () => {
        if (recordedChunks.length === 0) return;

        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `camera-feed-${feedId}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const captureScreenshot = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `screenshot-${feedId}-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }
        });
    };

    return (
        <Card className="w-fit">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="relative">
                    {applyFilter ? (
                        <canvas
                            ref={canvasRef}
                            width={width}
                            height={height}
                            className="border rounded-lg bg-gray-100"
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            width={width}
                            height={height}
                            autoPlay
                            muted
                            playsInline
                            className="border rounded-lg bg-gray-100"
                        />
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 rounded-lg">
                            <div className="text-sm text-gray-600">Loading camera...</div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 rounded-lg">
                            <div className="text-sm text-red-600 text-center p-2">{error}</div>
                        </div>
                    )}

                    {isRecording && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            REC
                        </div>
                    )}
                </div>

                {showControls && (
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => activeStream ? stopCamera() : startCamera()}
                            disabled={isLoading}
                        >
                            {activeStream ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!activeStream}
                        >
                            {isRecording ? 'Stop Rec' : 'Record'}
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={captureScreenshot}
                            disabled={!activeStream}
                        >
                            <Camera className="w-4 h-4" />
                        </Button>

                        {recordedChunks.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={downloadRecording}
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
