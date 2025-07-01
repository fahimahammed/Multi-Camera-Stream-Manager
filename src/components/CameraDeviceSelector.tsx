
import React, { useEffect, useState } from 'react';
import { useCameraContext } from '../contexts/CameraContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, RefreshCw } from 'lucide-react';

export const CameraDeviceSelector: React.FC = () => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        getAvailableDevices,
        startCamera,
        switchCamera,
        activeStream,
        isLoading
    } = useCameraContext();

    const loadDevices = async () => {
        setIsRefreshing(true);
        try {
            const availableDevices = await getAvailableDevices();
            setDevices(availableDevices);
            console.log('Available camera devices:', availableDevices);

            if (availableDevices.length > 0 && !selectedDevice) {
                setSelectedDevice(availableDevices[0].deviceId);
            }
        } catch (err) {
            console.error('Failed to load camera devices:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadDevices();
    }, []);

    const handleDeviceChange = async (deviceId: string) => {
        setSelectedDevice(deviceId);
        if (activeStream) {
            await switchCamera(deviceId);
        }
    };

    const handleStartCamera = async () => {
        if (selectedDevice) {
            await startCamera(selectedDevice);
        } else if (devices.length > 0) {
            await startCamera(devices[0].deviceId);
        } else {
            await startCamera(); // Use default device
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Camera Controls
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Camera Device:</label>
                    <div className="flex gap-2">
                        <Select value={selectedDevice} onValueChange={handleDeviceChange}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Choose camera device" />
                            </SelectTrigger>
                            <SelectContent>
                                {devices.map((device) => (
                                    <SelectItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={loadDevices}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Button
                        onClick={handleStartCamera}
                        disabled={isLoading || devices.length === 0}
                        className="w-full"
                    >
                        {isLoading ? 'Starting Camera...' : 'Start Camera'}
                    </Button>

                    <div className="text-xs text-gray-500">
                        {devices.length === 0 ? 'No camera devices found' : `${devices.length} camera(s) available`}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
