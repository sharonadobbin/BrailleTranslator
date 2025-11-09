import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Volume2, RotateCcw, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const OutputSection = () => {
  const [brailleOutput, setBrailleOutput] = useState("");
  const { toast } = useToast();

  const handleTextToBraille = () => {
    // Simulate Braille translation
    const sampleBraille = "⠠⠓⠑⠇⠇⠕ ⠠⠺⠕⠗⠇⠙";
    setBrailleOutput(sampleBraille);
    toast({
      title: "Translation Complete",
      description: "Text has been converted to Braille successfully.",
    });
  };


  const handleBrailleToText = () => {
    toast({
      title: "Converting Braille",
      description: "Processing Braille image to text...",
    });
    // Simulate processing
    setTimeout(() => {
      toast({
        title: "Conversion Complete",
        description: "Braille has been converted to text.",
      });
    }, 2000);
  };

  const handleBrailleToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance("Hello World");
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    
    toast({
      title: "Playing Audio",
      description: "Converting Braille to speech...",
    });
  };

  // Convert Braille Unicode to ASCII for BRF format
  const convertToAscii = (brailleText: string): string => {
    const brailleToAscii: { [key: string]: string } = {
      '⠀': ' ',   // Space
      '⠁': 'a',   // A
      '⠃': 'b',   // B
      '⠉': 'c',   // C
      '⠙': 'd',   // D
      '⠑': 'e',   // E
      '⠋': 'f',   // F
      '⠛': 'g',   // G
      '⠓': 'h',   // H
      '⠊': 'i',   // I
      '⠚': 'j',   // J
      '⠅': 'k',   // K
      '⠇': 'l',   // L
      '⠍': 'm',   // M
      '⠝': 'n',   // N
      '⠕': 'o',   // O
      '⠏': 'p',   // P
      '⠟': 'q',   // Q
      '⠗': 'r',   // R
      '⠎': 's',   // S
      '⠞': 't',   // T
      '⠥': 'u',   // U
      '⠧': 'v',   // V
      '⠺': 'w',   // W
      '⠭': 'x',   // X
      '⠽': 'y',   // Y
      '⠵': 'z',   // Z
      '⠠': ',',   // Capital sign (represented as comma in ASCII)
      ' ': ' ',   // Regular space
    };

    return brailleText
      .split('')
      .map(char => brailleToAscii[char] || char)
      .join('');
  };

  const handleDownloadTxt = () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to download",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([brailleOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'translated_braille.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Braille text file has been downloaded successfully.",
    });
  };

  const handleDownloadBrf = () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to download",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    const asciiContent = convertToAscii(brailleOutput);
    const blob = new Blob([asciiContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'translated_braille.brf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "BRF Download Complete",
      description: "Braille-Ready Format file has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    if (!brailleOutput.trim()) {
      toast({
        title: "No content to print",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Braille Translation - Print</title>
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
            .braille-content {
              white-space: pre-wrap;
              font-size: 20px;
              line-height: 2;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Braille Translation Output</h1>
            <p>Generated by AI-Powered Braille Translation System</p>
          </div>
          <div class="braille-content">${brailleOutput}</div>
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
    <Card className="p-8 bg-gradient-card shadow-soft border-0">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Braille Output</h2>
      
      {/* Braille Display */}
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
          aria-describedby="brailleOutputHelp"
        />
        <p id="brailleOutputHelp" className="text-sm text-muted-foreground">
          The translated Braille text will be displayed here with visual dot patterns.
        </p>
      </div>

      {/* Translation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          onClick={handleTextToBraille}
          className="flex items-center gap-2 h-12"
          aria-describedby="textToBrailleHelp"
        >
          <FileText className="w-4 h-4" />
          Text to Braille
        </Button>
        
        <Button
          onClick={handleBrailleToText}
          variant="outline"
          className="flex items-center gap-2 h-12"
          aria-describedby="brailleToTextHelp"
        >
          <RotateCcw className="w-4 h-4" />
          Braille to Text
        </Button>
        
        <Button
          onClick={handleBrailleToSpeech}
          variant="outline"
          className="flex items-center gap-2 h-12"
          aria-describedby="brailleToSpeechHelp"
        >
          <Volume2 className="w-4 h-4" />
          Braille to Speech
        </Button>
      </div>

      {/* Button descriptions for accessibility */}
      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
        <p id="textToBrailleHelp">Convert typed text input to Braille</p>
        <p id="brailleToTextHelp">Convert uploaded Braille images to text</p>
        <p id="brailleToSpeechHelp">Convert Braille to spoken audio</p>
      </div>

      {/* Export and Print Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-medium text-foreground mb-4">Export & Print Options</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            onClick={handleDownloadTxt}
            variant="outline"
            className="flex items-center gap-2 h-12"
            aria-describedby="downloadTxtHelp"
          >
            <Download className="w-4 h-4" />
            Download as .TXT
          </Button>
          
          <Button
            onClick={handleDownloadBrf}
            variant="outline"
            className="flex items-center gap-2 h-12"
            aria-describedby="downloadBrfHelp"
          >
            <Download className="w-4 h-4" />
            Download as .BRF
          </Button>
          
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2 h-12"
            aria-describedby="printHelp"
          >
            <Printer className="w-4 h-4" />
            Print Braille
          </Button>
        </div>

        {/* Export descriptions for accessibility */}
        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          <p id="downloadTxtHelp">Download Braille translation as plain text file</p>
          <p id="downloadBrfHelp">Download as Braille-Ready Format for embossers and displays</p>
          <p id="printHelp">Open print dialog to print the Braille content</p>
        </div>
      </div>
    </Card>
  );
};