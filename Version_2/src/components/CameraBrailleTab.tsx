import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, Volume2, Copy, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000"; // Flask backend URL

// Braille mapping
const textToBraille: { [key: string]: string } = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
  'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
  'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
  'y': '⠽', 'z': '⠵', ' ': '⠀', '0': '⠚', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙',
  '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊'
};

export const CameraBrailleTab = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [brailleOutput, setBrailleOutput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .jpg, .jpeg, or .png image.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setUploadedImage(imageDataUrl);
      setExtractedText("");
      setBrailleOutput("");
    };
    reader.readAsDataURL(file);

    await extractTextFromBackend(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // ✅ New: Send image to Flask OCR endpoint
  const extractTextFromBackend = async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast({
        title: "Extracting text",
        description: "Sending image to OCR backend...",
      });

      // Simulate progress bar
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 15, 90));
      }, 200);

      const response = await axios.post(`${BASE_URL}/api/ocr`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      const detectedText = response.data.text || "";

      setExtractedText(detectedText);

      toast({
        title: "Text extracted successfully",
        description: detectedText
          ? `Extracted: "${detectedText.substring(0, 50)}${detectedText.length > 50 ? "..." : ""}"`
          : "No readable text found in the image.",
      });
    } catch (error) {
      console.error("Error during OCR:", error);
      toast({
        title: "OCR failed",
        description: "Unable to extract text from the image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = () => {
    if (!extractedText) {
      toast({
        title: "No text to translate",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    const brailleTranslation = extractedText
      .toLowerCase()
      .split("")
      .map((char) => textToBraille[char] || char)
      .join("");

    setBrailleOutput(brailleTranslation);

    toast({
      title: "Translation complete",
      description: "Text converted to Braille successfully.",
    });
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
    const blob = new Blob([brailleOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "braille-output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printBraille = () => {
    if (!brailleOutput) return;
    const printWindow = window.open("", "_blank");
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
            Select or drag and drop an image file containing text to convert to Braille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Select Image (.jpg, .jpeg, .png)
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop an image here</p>
            </div>

            {uploadedImage && (
              <div className="space-y-4">
                <img
                  src={uploadedImage}
                  alt="Uploaded image"
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Extracting Text</CardTitle>
            <CardDescription>Processing image and extracting text...</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={processingProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">{processingProgress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text Input */}
      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Text</CardTitle>
            <CardDescription>Text extracted from the uploaded image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-[120px]"
              placeholder="Extracted text will appear here..."
            />
            <Button onClick={handleTranslate} className="w-full">
              Translate to Braille
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Braille Output */}
      {brailleOutput && (
        <Card>
          <CardHeader>
            <CardTitle>Braille Translation</CardTitle>
            <CardDescription>The extracted text converted to Braille</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={brailleOutput}
              readOnly
              className="min-h-[120px] font-mono text-lg"
              style={{ fontFamily: "monospace, serif" }}
            />

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
    </div>
  );
};
