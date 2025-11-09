import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  X,
  Wand2,
  FileText,
  ArrowLeft,
  Volume2,
  Download,
  Printer
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ManualTextTranslatorProps {
  extractedText: string;
  fileName: string;
  onNewDocument: () => void;
}

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

export const ManualTextTranslator = ({ extractedText, fileName, onNewDocument }: ManualTextTranslatorProps) => {
  const [selectedText, setSelectedText] = useState("");
  const [brailleOutput, setBrailleOutput] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const selectedString = selection.toString().trim();
      
      if (selectedString) {
        setSelectedText(selectedString);
        
        // Get selection position for menu placement
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setShowMenu(true);
      } else {
        setShowMenu(false);
        setSelectedText("");
      }
    }
  };

  const handleCopy = async () => {
    if (!selectedText) return;

    try {
      await navigator.clipboard.writeText(selectedText);
      toast({
        title: "Copied to Clipboard",
        description: "Selected text copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
    setShowMenu(false);
  };

  const handleClear = () => {
    window.getSelection()?.removeAllRanges();
    setSelectedText("");
    setShowMenu(false);
  };

  const handleTranslate = async () => {
    if (!selectedText) return;

    setIsTranslating(true);
    setShowMenu(false);
    
    // Simulate translation process
    setTimeout(() => {
      const translated = textToBraille(selectedText);
      setBrailleOutput(translated);
      setIsTranslating(false);
      
      toast({
        title: "Translation Complete",
        description: "Selected text has been converted to Braille successfully.",
      });
    }, 1000);
  };

  const handleListen = () => {
    if (!selectedText) return;

    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(selectedText);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    
    toast({
      title: "Playing Audio",
      description: "Reading the selected text aloud...",
    });
  };

  const handleCopyBraille = async () => {
    if (!brailleOutput) return;

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

  const handleDownloadBraille = () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to download",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    const formattedContent = `Selected text: ${selectedText}\n\nTranslated text: ${brailleOutput}`;
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manual_selection_braille.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Braille translation downloaded successfully.",
    });
  };

  const handlePrintBraille = () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to print",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    const formattedOutput = `Selected text: ${selectedText}\n\nTranslated text: ${brailleOutput}`;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Braille Translation - Manual Selection</title>
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
            <h3>Manual Selection</h3>
            <p>Source: ${fileName}</p>
            <p>Selection Type: Manual Text Selection</p>
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Manual Text Selection</h3>
            <p className="text-sm text-muted-foreground">From: {fileName}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onNewDocument}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Text Selection Area */}
      <Card className="p-6 bg-gradient-card shadow-soft border-0 relative">
        <div className="space-y-4">
          <Label className="text-lg font-medium text-foreground">
            Document Content - Select Text to Translate
          </Label>
          
          <div
            ref={textContainerRef}
            className="relative max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg border border-border"
            onMouseUp={handleTextSelection}
            style={{ userSelect: 'text' }}
          >
            <div className="whitespace-pre-wrap text-foreground leading-relaxed select-text">
              {extractedText}
            </div>
            
            {/* Floating Selection Menu */}
            {showMenu && (
              <div
                className="fixed z-50 flex items-center gap-1 bg-background border border-border rounded-lg shadow-lg p-2"
                style={{
                  left: menuPosition.x - 60,
                  top: menuPosition.y - 50,
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2 text-xs"
                  title="Copy selected text"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 px-2 text-xs"
                  title="Clear selection"
                >
                  <X className="w-3 h-3" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleTranslate}
                  className="h-8 px-2 text-xs"
                  title="Translate to Braille"
                  disabled={isTranslating}
                >
                  <Wand2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {selectedText && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Selected text:</p>
              <p className="text-sm text-foreground italic">"{selectedText.length > 100 ? selectedText.substring(0, 100) + '...' : selectedText}"</p>
            </div>
          )}
        </div>
      </Card>

      {/* Braille Output Section */}
      {(brailleOutput || isTranslating) && (
        <Card className="p-6 bg-gradient-card shadow-soft border-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium text-foreground">
                Braille Translation
              </Label>
            </div>
            
            <Textarea
              value={isTranslating ? "Translating..." : brailleOutput}
              readOnly
              placeholder="Braille translation will appear here..."
              className="min-h-[120px] text-xl font-mono resize-none bg-muted/30 focus:ring-2 focus:ring-primary"
            />
            
            {brailleOutput && (
              <p className="text-xs text-muted-foreground">
                {brailleOutput.length} characters in Braille
              </p>
            )}

            {/* Action Buttons */}
            {brailleOutput && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleListen} className="gap-2">
                  <Volume2 className="w-4 h-4" />
                  Listen
                </Button>
                <Button variant="outline" onClick={handleCopyBraille} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button variant="outline" onClick={handleDownloadBraille} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handlePrintBraille} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};