import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, X, Check, Volume2, Copy, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pipeline } from '@huggingface/transformers';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

let ocrPipeline: any = null;
let modelLoadingPromise: Promise<any> | null = null;

// Braille patterns mapping for text-to-braille
const textToBraille: { [key: string]: string } = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 
  'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
  'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
  'y': '⠽', 'z': '⠵', ' ': '⠀', '0': '⠚', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', 
  '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊'
};

export const CameraBrailleTab = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [brailleOutput, setBrailleOutput] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { toast } = useToast();

  // Initialize OCR model
  const initializeModel = useCallback(async () => {
    if (ocrPipeline) return;
    if (modelLoadingPromise) return modelLoadingPromise;

    try {
      modelLoadingPromise = pipeline('image-to-text', 'Xenova/trocr-base-printed');
      ocrPipeline = await modelLoadingPromise;
    } catch (error) {
      console.error('Error loading OCR model:', error);
    } finally {
      modelLoadingPromise = null;
    }
  }, []);

  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .jpg, .jpeg, .png, or .gif image.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setCapturedImage(null);
        setFinalImage(null);
        setExtractedText("");
        setBrailleOutput("");
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setUploadedImage(null);
        setCapturedImage(null);
        setFinalImage(null);
        setExtractedText("");
        setBrailleOutput("");
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access failed",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    setShowCropper(true);
  };

  const discardCapture = () => {
    setCapturedImage(null);
    setShowCropper(false);
  };

  const acceptImage = async () => {
    let imageToProcess = capturedImage || uploadedImage;

    if (showCropper && completedCrop && imgRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
      
      imageToProcess = canvas.toDataURL('image/jpeg');
    }

    setFinalImage(imageToProcess);
    setShowCropper(false);
    if (isStreaming) {
      stopCamera();
    }

    // Process the image
    await processImage(imageToProcess);
  };

  const processImage = async (imageDataUrl: string | null) => {
    if (!imageDataUrl || !ocrPipeline) {
      toast({
        title: "Not ready",
        description: "OCR model is still loading. Please wait.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await ocrPipeline(imageDataUrl);
      const detectedText = result.generated_text || "";
      
      clearInterval(progressInterval);
      setProcessingProgress(100);

      setExtractedText(detectedText);

      // Convert extracted text to Braille
      const brailleTranslation = detectedText.toLowerCase().split('').map(char => 
        textToBraille[char] || char
      ).join('');
      
      setBrailleOutput(brailleTranslation);

      toast({
        title: "Processing complete",
        description: `Extracted: "${detectedText.substring(0, 50)}${detectedText.length > 50 ? '...' : ''}"`,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing failed", 
        description: "Could not process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = () => {
    if (!extractedText) return;
    const utterance = new SpeechSynthesisUtterance(extractedText);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const copyText = () => {
    if (brailleOutput) {
      navigator.clipboard.writeText(brailleOutput);
      toast({ title: "Copied", description: "Braille text copied to clipboard." });
    }
  };

  const downloadBraille = () => {
    if (!brailleOutput) return;
    const blob = new Blob([brailleOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'braille-output.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printBraille = () => {
    if (!brailleOutput) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Braille Output</title></head>
          <body style="font-family: monospace; font-size: 18px; line-height: 1.6;">
            <h2>Braille Translation</h2>
            <div style="white-space: pre-wrap;">${brailleOutput}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Image Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Image
          </CardTitle>
          <CardDescription>
            Select an image file containing text to convert to Braille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Image (.jpg, .jpeg, .png, .gif)
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {uploadedImage && !showCropper && (
              <div className="space-y-4">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded image" 
                  className="max-w-full h-auto rounded-lg border"
                />
                <Button onClick={acceptImage} className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Process This Image
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Capture Image Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Capture Image
          </CardTitle>
          <CardDescription>
            Use your camera to capture an image of text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isStreaming ? (
              <Button onClick={startCamera} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Open Camera
              </Button>
            ) : (
              <>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={discardCapture} variant="outline" size="lg">
                    <X className="h-5 w-5" />
                  </Button>
                  <Button onClick={capturePhoto} size="lg">
                    <Camera className="h-5 w-5" />
                  </Button>
                  <Button onClick={acceptImage} variant="outline" size="lg">
                    <Check className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Cropping */}
      {showCropper && (capturedImage || uploadedImage) && (
        <Card>
          <CardHeader>
            <CardTitle>Crop Image</CardTitle>
            <CardDescription>
              Select the area containing the text you want to convert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
                aspect={undefined}
              >
                <img
                  ref={imgRef}
                  src={capturedImage || uploadedImage || ''}
                  alt="Crop preview"
                  className="max-w-full h-auto"
                />
              </ReactCrop>
              <div className="flex gap-2">
                <Button onClick={discardCapture} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={acceptImage}>
                  <Check className="h-4 w-4 mr-2" />
                  Accept Crop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Image</CardTitle>
            <CardDescription>
              Extracting text and converting to Braille...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={processingProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {processingProgress}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {/* Final processed image */}
      {finalImage && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={finalImage} 
              alt="Processed image" 
              className="max-w-full h-auto rounded-lg border"
            />
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {brailleOutput && (
        <Card>
          <CardHeader>
            <CardTitle>Braille Translation</CardTitle>
            <CardDescription>
              The extracted text converted to Braille
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {extractedText && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Extracted Text:</label>
                <Textarea
                  value={extractedText}
                  readOnly
                  className="min-h-[80px] bg-muted"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Braille Output:</label>
              <Textarea
                value={brailleOutput}
                readOnly
                className="min-h-[120px] font-mono text-lg"
                style={{ fontFamily: 'monospace, serif' }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={speakText} variant="outline">
                <Volume2 className="h-4 w-4 mr-2" />
                Listen
              </Button>
              <Button onClick={copyText} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadBraille} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={printBraille} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};