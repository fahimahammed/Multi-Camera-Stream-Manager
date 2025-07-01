import { CameraProvider } from '../contexts/CameraContext';
import { MultiCameraGrid } from '../components/MultiCameraGrid';

const Index = () => {
    // const features = [
    //     {
    //         icon: <Video className="w-6 h-6 text-blue-500" />,
    //         title: "Stream Sharing",
    //         description: "Share a single camera stream across multiple components without conflicts"
    //     },
    //     {
    //         icon: <Zap className="w-6 h-6 text-green-500" />,
    //         title: "Real-time Recording",
    //         description: "Record camera feeds with built-in MediaRecorder API support"
    //     },
    //     {
    //         icon: <Grid3X3 className="w-6 h-6 text-purple-500" />,
    //         title: "Multi-Feed Layout",
    //         description: "Display multiple camera feeds in customizable grid layouts"
    //     },
    //     {
    //         icon: <Palette className="w-6 h-6 text-orange-500" />,
    //         title: "Canvas Filters",
    //         description: "Apply real-time filters and effects using Canvas API"
    //     }
    // ];

    return (
        <CameraProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Multi-Camera Stream Manager
                        </h1>
                    </div>

                    {/* Features Grid */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        {feature.icon}
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div> */}

                    {/* Main Camera Interface */}
                    <MultiCameraGrid />

                    {/* Technical Notes */}
                    {/* <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-800">Technical Solutions Implemented</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <strong className="text-blue-700">Stream Cloning:</strong> Uses MediaStream.clone() to create multiple video elements from a single camera source
                            </div>
                            <div>
                                <strong className="text-blue-700">Context-Based Management:</strong> React Context Provider manages camera state across all components
                            </div>
                            <div>
                                <strong className="text-blue-700">Canvas Processing:</strong> Real-time video processing and filtering using HTML5 Canvas
                            </div>
                            <div>
                                <strong className="text-blue-700">MediaRecorder Integration:</strong> Built-in recording capabilities with WebM output
                            </div>
                            <div>
                                <strong className="text-blue-700">Device Switching:</strong> Dynamic camera device selection and switching without stream interruption
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </CameraProvider>
    );
};

export default Index;
