"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, FileText, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchBrailleTranslation } from "@/lib/brailleApi";

export const TextToBrailleTab = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [brailleGrade, setBrailleGrade] = useState<1 | 2>(1);
  const [brailleOutput, setBrailleOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  // 🎙️ Voice Input (unchanged)
  const handleVoiceInput = () => {
    const SpeechRecognitionAPI =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.onend = null;
      setIsListening(false);
      toast({ title: "Stopped Recording", description: "Speech recognition stopped." });
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: "Listening...", description: "Speak now to convert speech to text." });
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
      }
      if (finalTranscript) setText((prev) => (prev + " " + finalTranscript).trim());
    };

    recognition.onerror = (e: any) => {
      setIsListening(false);
      toast({
        title: "Speech recognition error",
        description: e.error || "An error occurred with speech recognition.",
        variant: "destructive",
      });
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // 🧠 Translate (unchanged, just relies on backend)
  const handleTextToBraille = async () => {
    if (!text.trim()) {
      toast({
        title: "No text entered",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      setBrailleOutput("");
      return;
    }

    setIsLoading(true);
    setBrailleOutput("Translating... Please wait.");

    try {
      const cleanedText = text.replace(/\s+/g, " ").trim();
      const translatedBraille = await fetchBrailleTranslation(cleanedText, brailleGrade);

      if (!translatedBraille || !translatedBraille.trim()) {
        setBrailleOutput("⚠️ No Braille output generated. Please check your input.");
      } else {
        setBrailleOutput(translatedBraille);
      }

      toast({
        title: "Translation Complete",
        description: `Text converted to Braille successfully (Grade ${brailleGrade}).`,
      });

      setTimeout(() => {
        document.getElementById("brailleOutput")?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } catch (error) {
      console.error("Translation error:", error);
      setBrailleOutput("❌ Translation failed. Please try again.");
      toast({
        title: "Translation Failed",
        description: "Could not connect to the backend translator.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Download & Print handlers (unchanged)
  const handleDownloadTxt = () => {
    if (!brailleOutput.trim() || isLoading) {
      toast({ title: "No content to download", variant: "destructive" });
      return;
    }
    const formatted = `Text:\n${text}\n\nTranslated Braille:\n${brailleOutput}`;
    const blob = new Blob([formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "translated_braille.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Download Complete", description: "TXT file downloaded." });
  };

  const handleDownloadBrf = () => {
    if (!brailleOutput.trim() || isLoading) {
      toast({ title: "No content to download", variant: "destructive" });
      return;
    }
    const formatted = `Text:\n${text}\n\nTranslated Braille:\n${brailleOutput}`;
    const blob = new Blob([formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "translated_braille.brf";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "BRF Download Complete", description: "BRF file downloaded." });
  };

  const handlePrint = () => {
    if (!brailleOutput.trim() || isLoading) {
      toast({ title: "No content to print", variant: "destructive" });
      return;
    }

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Braille Translation - Print</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 18px; line-height: 1.6; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .content { white-space: pre-wrap; margin-bottom: 20px; }
            .braille-content { white-space: pre-wrap; font-size: 20px; line-height: 2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Braille Translation Output</h1>
            <p>Generated by AI-Powered Braille Translation System</p>
          </div>
          <div class="content">Text:\n${text}\n\nTranslated Braille:</div>
          <div class="braille-content">${brailleOutput}</div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
    toast({ title: "Print Dialog Opened", description: "Ready to print Braille output." });
  };

  // 🧩 UI (unchanged)
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Input */}
      <Card className="p-8 bg-gradient-card shadow-soft border-0">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Input</h2>

        {/* Grade Selection */}
        <div className="space-y-4 mb-8">
          <label className="block text-sm font-medium text-foreground">Braille Grade</label>
          <div className="flex gap-3">
            {[1, 2].map((grade) => (
              <Button
                key={grade}
                onClick={() => setBrailleGrade(grade as 1 | 2)}
                variant={brailleGrade === grade ? "default" : "outline"}
                className="btn-uniform flex-1"
                disabled={isLoading}
              >
                Grade {grade}
              </Button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-4 mb-6">
          <label htmlFor="textInput" className="block text-sm font-medium text-foreground">
            Text Input
          </label>
          <Textarea
            id="textInput"
            placeholder="Enter or paste text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] text-base resize-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
        </div>

        {/* Voice Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">Voice Input</label>
          <Button
            onClick={handleVoiceInput}
            variant={isListening ? "destructive" : "outline"}
            className="btn-uniform flex items-center gap-2"
            disabled={isLoading}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? "Stop Recording" : "Voice Input"}
          </Button>
        </div>
      </Card>

      {/* Output */}
      <Card className="p-8 bg-gradient-card shadow-soft border-0">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Braille Output</h2>

        <div className="space-y-4 mb-8">
          <label htmlFor="brailleOutput" className="block text-sm font-medium text-foreground">
            Braille Translation
          </label>
          <Textarea
            id="brailleOutput"
            value={brailleOutput}
            readOnly
            placeholder="Braille output will appear here..."
            className="min-h-[120px] text-xl font-mono resize-none bg-muted/30 focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-8">
          <Button
            onClick={handleTextToBraille}
            className="btn-uniform flex items-center gap-2 w-full"
            disabled={isLoading || !text.trim()}
          >
            <FileText className="w-4 h-4" />
            {isLoading ? "Translating..." : "Text to Braille"}
          </Button>
        </div>

        {/* Export */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">Export & Print</h3>
          <div className="grid grid-cols-1 gap-4">
            <Button onClick={handleDownloadTxt} variant="outline" className="btn-uniform flex items-center gap-2" disabled={isLoading}>
              <Download className="w-4 h-4" /> Download as .TXT
            </Button>
            <Button onClick={handleDownloadBrf} variant="outline" className="btn-uniform flex items-center gap-2" disabled={isLoading}>
              <Download className="w-4 h-4" /> Download as .BRF
            </Button>
            <Button onClick={handlePrint} variant="outline" className="btn-uniform flex items-center gap-2" disabled={isLoading}>
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
