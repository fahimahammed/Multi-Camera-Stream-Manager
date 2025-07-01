
import React, { useState } from 'react';
import { CameraFeed } from './CameraFeed';
import { CameraDeviceSelector } from './CameraDeviceSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, Maximize2, Settings } from 'lucide-react';

export const MultiCameraGrid: React.FC = () => {
    const [gridLayout, setGridLayout] = useState<'2x2' | '1x3' | '3x1'>('2x2');
    const [showSettings, setShowSettings] = useState(false);

    const getGridClasses = () => {
        switch (gridLayout) {
            case '2x2':
                return 'grid grid-cols-2 gap-4';
            case '1x3':
                return 'grid grid-cols-1 gap-4';
            case '3x1':
                return 'grid grid-cols-3 gap-4';
            default:
                return 'grid grid-cols-2 gap-4';
        }
    };

    const feeds = [
        { id: 'main', title: 'Main Feed', showControls: true },
        { id: 'secondary', title: 'Secondary Feed', showControls: false },
        { id: 'filtered', title: 'Filtered Feed (Grayscale)', showControls: false, applyFilter: true },
        { id: 'recording', title: 'Recording Feed', showControls: true }
    ];

    return (
        <div className="w-full space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Grid3X3 className="w-5 h-5" />
                            Multi-Camera Stream Grid
                        </span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowSettings(!showSettings)}
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {showSettings && (
                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <div className="space-y-4">
                                <CameraDeviceSelector />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Grid Layout:</label>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={gridLayout === '2x2' ? 'default' : 'outline'}
                                            onClick={() => setGridLayout('2x2')}
                                        >
                                            2x2 Grid
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={gridLayout === '1x3' ? 'default' : 'outline'}
                                            onClick={() => setGridLayout('1x3')}
                                        >
                                            1x3 Stack
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={gridLayout === '3x1' ? 'default' : 'outline'}
                                            onClick={() => setGridLayout('3x1')}
                                        >
                                            3x1 Row
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Tabs defaultValue="grid" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="grid">Grid View</TabsTrigger>
                            <TabsTrigger value="focus">Focus View</TabsTrigger>
                        </TabsList>

                        <TabsContent value="grid" className="mt-6">
                            <div className={getGridClasses()}>
                                {feeds.map((feed) => (
                                    <CameraFeed
                                        key={feed.id}
                                        feedId={feed.id}
                                        title={feed.title}
                                        width={280}
                                        height={210}
                                        showControls={feed.showControls}
                                        applyFilter={feed.applyFilter}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="focus" className="mt-6">
                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <CameraFeed
                                        feedId="focus-main"
                                        title="Main Focus Feed"
                                        width={640}
                                        height={480}
                                        showControls={true}
                                    />
                                </div>
                                <div className="space-y-4">
                                    {feeds.slice(0, 3).map((feed) => (
                                        <CameraFeed
                                            key={`mini-${feed.id}`}
                                            feedId={`mini-${feed.id}`}
                                            title={`Mini ${feed.title}`}
                                            width={160}
                                            height={120}
                                            showControls={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
