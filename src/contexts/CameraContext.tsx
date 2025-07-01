
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface CameraStream {
    id: string;
    stream: MediaStream | null;
    isActive: boolean;
    deviceId?: string;
    constraints?: MediaStreamConstraints;
}

interface CameraContextType {
    streams: CameraStream[];
    activeStream: MediaStream | null;
    isLoading: boolean;
    error: string | null;
    startCamera: (deviceId?: string, constraints?: MediaStreamConstraints) => Promise<void>;
    stopCamera: () => void;
    switchCamera: (deviceId: string) => Promise<void>;
    getAvailableDevices: () => Promise<MediaDeviceInfo[]>;
    createStreamClone: (streamId: string) => MediaStream | null;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const useCameraContext = () => {
    const context = useContext(CameraContext);
    if (!context) {
        throw new Error('useCameraContext must be used within a CameraProvider');
    }
    return context;
};

interface CameraProviderProps {
    children: ReactNode;
}

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
    const [streams, setStreams] = useState<CameraStream[]>([]);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamIdCounter = useRef(0);

    const getAvailableDevices = async (): Promise<MediaDeviceInfo[]> => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(device => device.kind === 'videoinput');
        } catch (err) {
            console.error('Error getting devices:', err);
            return [];
        }
    };

    const startCamera = async (deviceId?: string, constraints?: MediaStreamConstraints) => {
        setIsLoading(true);
        setError(null);

        try {
            const defaultConstraints: MediaStreamConstraints = {
                video: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: false
            };

            const finalConstraints = constraints || defaultConstraints;
            const stream = await navigator.mediaDevices.getUserMedia(finalConstraints);

            const newStream: CameraStream = {
                id: `stream-${streamIdCounter.current++}`,
                stream,
                isActive: true,
                deviceId,
                constraints: finalConstraints
            };

            setStreams(prev => [...prev, newStream]);
            setActiveStream(stream);

            console.log('Camera started successfully:', newStream.id);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
            setError(errorMessage);
            console.error('Camera error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (activeStream) {
            activeStream.getTracks().forEach(track => {
                track.stop();
                console.log('Stopped track:', track.kind);
            });
        }

        streams.forEach(streamObj => {
            if (streamObj.stream) {
                streamObj.stream.getTracks().forEach(track => track.stop());
            }
        });

        setStreams([]);
        setActiveStream(null);
        setError(null);
        console.log('All camera streams stopped');
    };

    const switchCamera = async (deviceId: string) => {
        if (activeStream) {
            const currentConstraints = streams.find(s => s.stream === activeStream)?.constraints;
            await stopCamera();
            await startCamera(deviceId, currentConstraints);
        }
    };

    const createStreamClone = (streamId: string): MediaStream | null => {
        const streamObj = streams.find(s => s.id === streamId);
        if (!streamObj || !streamObj.stream) return null;

        try {
            // Clone the stream for use in multiple video elements
            const clonedStream = streamObj.stream.clone();
            console.log('Created stream clone for:', streamId);
            return clonedStream;
        } catch (err) {
            console.error('Error cloning stream:', err);
            return null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const contextValue: CameraContextType = {
        streams,
        activeStream,
        isLoading,
        error,
        startCamera,
        stopCamera,
        switchCamera,
        getAvailableDevices,
        createStreamClone
    };

    return (
        <CameraContext.Provider value={contextValue}>
            {children}
        </CameraContext.Provider>
    );
};
