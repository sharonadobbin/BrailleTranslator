import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Volume2, 
  Download, 
  Printer, 
  Copy,
  Hash,
  AlignLeft,
  Table,
  Wand2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ParsedSection } from "../DocumentParserTab";

interface SectionTranslatorProps {
  section: ParsedSection;
  fileName: string;
  onBack: () => void;
  onNewDocument: () => void;
}

const getSectionIcon = (type: ParsedSection['type']) => {
  switch (type) {
    case 'header':
      return Hash;
    case 'paragraph':
      return AlignLeft;
    case 'table':
      return Table;
    default:
      return FileText;
  }
};

const getSectionColor = (type: ParsedSection['type']) => {
  switch (type) {
    case 'header':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'paragraph':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'table':
      return 'bg-secondary text-secondary-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

// Convert text to Braille (simplified mapping)
const textToBraille = (text: string): string => {
  const brailleMap: { [key: string]: string } = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
    ' ': '⠀', '\n': '\n', '\t': '\t'
  };

  return text.toLowerCase().split('').map(char => {
    if (brailleMap[char]) return brailleMap[char];
    if (char.match(/[0-9]/)) return '⠼' + brailleMap[char] || char;
    return char;
  }).join('');
};

export const SectionTranslator = ({ section, fileName, onBack, onNewDocument }: SectionTranslatorProps) => {
  const [brailleOutput, setBrailleOutput] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();
  const Icon = getSectionIcon(section.type);

  const handleTranslate = async () => {
    setIsTranslating(true);
    
    // Simulate translation process
    setTimeout(() => {
      const translated = textToBraille(section.content);
      setBrailleOutput(translated);
      setIsTranslating(false);
      
      toast({
        title: "Translation Complete",
        description: `${section.title} has been converted to Braille successfully.`,
      });
    }, 1500);
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(section.content);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    
    toast({
      title: "Playing Audio",
      description: "Reading the section content aloud...",
    });
  };

  const handleCopy = async () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to copy",
        description: "Please translate the section first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(brailleOutput);
      toast({
        title: "Copied to Clipboard",
        description: "Braille translation copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to download",
        description: "Please translate the section first.",
        variant: "destructive",
      });
      return;
    }

    const formattedContent = `Selected text: ${section.content}\n\nTranslated text: ${brailleOutput}`;
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${section.title.toLowerCase().replace(/\s+/g, '_')}_braille.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Braille translation downloaded successfully.",
    });
  };

  const handlePrint = () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to print",
        description: "Please translate the section first.",
        variant: "destructive",
      });
      return;
    }

    const formattedOutput = `Selected text: ${section.content}\n\nTranslated text: ${brailleOutput}`;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Braille Translation - ${section.title}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 18px;
              line-height: 1.6;
              margin: 40px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .section-info {
              background: #f5f5f5;
              padding: 15px;
              margin-bottom: 20px;
              border-left: 4px solid #333;
            }
            .output-content {
              white-space: pre-wrap;
              font-size: 16px;
              line-height: 1.8;
              background: #f9f9f9;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Braille Translation Output</h1>
            <p>Generated by AI-Powered Braille Translation System</p>
          </div>
          <div class="section-info">
            <h3>${section.title}</h3>
            <p>Source: ${fileName}</p>
            <p>Section Type: ${section.type.charAt(0).toUpperCase() + section.type.slice(1)}</p>
          </div>
          <div class="output-content">${formattedOutput}</div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }

    toast({
      title: "Opening Print Dialog",
      description: "Print dialog has been opened for the Braille content.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Sections
        </Button>
        <Button variant="outline" onClick={onNewDocument}>
          <FileText className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Section Info */}
      <Card className="p-6 bg-gradient-card shadow-soft border-0">
        <div className="flex items-start gap-4">
          <Icon className="w-8 h-8 text-primary mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              <Badge 
                variant="secondary" 
                className={`${getSectionColor(section.type)}`}
              >
                {section.type}
                {section.level && ` H${section.level}`}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">From: {fileName}</p>
            
            {/* Original Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Original Content</label>
              <Textarea
                value={section.content}
                readOnly
                className="min-h-[120px] resize-none bg-muted/30"
              />
              <p className="text-xs text-muted-foreground">
                {section.content.length} characters
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Translation Section */}
      <Card className="p-6 bg-gradient-card shadow-soft border-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Braille Translation</h3>
            <Button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className="gap-2"
            >
              <Wand2 className="w-4 h-4" />
              {isTranslating ? "Translating..." : "Translate to Braille"}
            </Button>
          </div>

          {/* Braille Output */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Braille Output</label>
            <Textarea
              value={brailleOutput}
              readOnly
              placeholder="Braille translation will appear here..."
              className="min-h-[150px] text-xl font-mono resize-none bg-muted/30 focus:ring-2 focus:ring-primary"
            />
            {brailleOutput && (
              <p className="text-xs text-muted-foreground">
                {brailleOutput.length} characters in Braille
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {brailleOutput && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleSpeech} className="gap-2">
                <Volume2 className="w-4 h-4" />
                Listen
              </Button>
              <Button variant="outline" onClick={handleCopy} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};