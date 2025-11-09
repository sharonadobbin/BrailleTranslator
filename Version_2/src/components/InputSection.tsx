import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const InputSection = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [brailleGrade, setBrailleGrade] = useState<1 | 2>(1);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['.docx', '.txt', '.brf', '.jpg', '.png', '.jpeg'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setUploadedFile(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for translation.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload .docx, .txt, .brf, .jpg, or .png files only.",
          variant: "destructive",
        });
      }
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now to convert your speech to text.",
      });
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      if (finalTranscript) {
        setText(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Speech recognition error",
        description: "There was an error with speech recognition.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Card className="p-8 bg-gradient-card shadow-soft border-0">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Input</h2>
      
      {/* Braille Grade Selection */}
      <div className="space-y-4 mb-8">
        <label className="block text-sm font-medium text-foreground">
          Braille Grade Selection
        </label>
        <div className="flex gap-3">
          <Button
            onClick={() => setBrailleGrade(1)}
            variant={brailleGrade === 1 ? "default" : "outline"}
            className="flex-1 h-12 text-base font-medium"
            aria-pressed={brailleGrade === 1}
          >
            Grade 1 Braille
          </Button>
          <Button
            onClick={() => setBrailleGrade(2)}
            variant={brailleGrade === 2 ? "default" : "outline"}
            className="flex-1 h-12 text-base font-medium"
            aria-pressed={brailleGrade === 2}
          >
            Grade 2 Braille
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Grade 1 is a letter-for-letter transcription of the alphabet without contractions. Grade 2 uses contractions and abbreviations to save space and increase reading speed.
        </p>
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
          aria-describedby="textInputHelp"
        />
        <p id="textInputHelp" className="text-sm text-muted-foreground">
          Type or paste the text you want to translate to Braille.
        </p>
      </div>

      {/* File Upload */}
      <div className="space-y-4 mb-6">
        <label htmlFor="fileUpload" className="block text-sm font-medium text-foreground">
          File Upload
        </label>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('fileUpload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
          <input
            id="fileUpload"
            type="file"
            accept=".docx,.txt,.brf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            aria-describedby="fileUploadHelp"
          />
          {uploadedFile && (
            <span className="text-sm text-muted-foreground truncate max-w-48">
              {uploadedFile.name}
            </span>
          )}
        </div>
        <p id="fileUploadHelp" className="text-sm text-muted-foreground">
          Supported formats: .docx, .txt, .brf, .jpg, .png
        </p>
      </div>

      {/* Voice Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Voice Input
        </label>
        <Button
          onClick={handleVoiceInput}
          variant={isListening ? "destructive" : "outline"}
          className="flex items-center gap-2"
          aria-pressed={isListening}
          aria-describedby="voiceInputHelp"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening ? "Stop Recording" : "Voice Input"}
        </Button>
        <p id="voiceInputHelp" className="text-sm text-muted-foreground">
          Click to start voice recording. Speak clearly for best results.
        </p>
      </div>
    </Card>
  );
};