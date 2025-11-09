import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Volume2, Keyboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BrailleQwertyKeyboard } from "./BrailleQwertyKeyboard";

const BrailleDot = ({ position, isPressed, onPress }: { position: number; isPressed: boolean; onPress: () => void }) => (
  <button
    onClick={onPress}
    className={`w-12 h-12 rounded-full border-2 transition-all ${
      isPressed 
        ? 'bg-primary border-primary shadow-lg' 
        : 'bg-background border-muted-foreground hover:border-primary'
    }`}
    aria-label={`Braille dot ${position}`}
  />
);

export const BrailleToTextTab = () => {
  const [brailleInput, setBrailleInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [activeDots, setActiveDots] = useState<boolean[]>([false, false, false, false, false, false]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const { toast } = useToast();

  const toggleDot = (index: number) => {
    const newDots = [...activeDots];
    newDots[index] = !newDots[index];
    setActiveDots(newDots);
  };

  const addBrailleCharacter = () => {
    // Simple mapping for demonstration - in reality this would be more comprehensive
    const brailleMap: { [key: string]: string } = {
      "100000": "⠁", // A
      "110000": "⠃", // B
      "100100": "⠉", // C
      "100110": "⠙", // D
      "100010": "⠑", // E
      "110100": "⠋", // F
      "110110": "⠛", // G
      "110010": "⠓", // H
      "010100": "⠊", // I
      "010110": "⠚", // J
      "101000": "⠅", // K
      "111000": "⠇", // L
      "101100": "⠍", // M
      "101110": "⠝", // N
      "101010": "⠕", // O
      "111100": "⠏", // P
      "111110": "⠟", // Q
      "111010": "⠗", // R
      "011100": "⠎", // S
      "011110": "⠞", // T
      "101001": "⠥", // U
      "111001": "⠧", // V
      "010111": "⠺", // W
      "101101": "⠭", // X
      "101111": "⠽", // Y
      "101011": "⠵", // Z
      "000000": " ",   // Space
    };

    const dotPattern = activeDots.map(dot => dot ? "1" : "0").join("");
    const brailleChar = brailleMap[dotPattern] || "?";
    
    setBrailleInput(prev => prev + brailleChar);
    setActiveDots([false, false, false, false, false, false]);
  };

  const clearInput = () => {
    setBrailleInput("");
    setActiveDots([false, false, false, false, false, false]);
  };

  const handleBrailleToText = () => {
    // Simple conversion for demonstration
    const textMap: { [key: string]: string } = {
      "⠁": "A", "⠃": "B", "⠉": "C", "⠙": "D", "⠑": "E", "⠋": "F",
      "⠛": "G", "⠓": "H", "⠊": "I", "⠚": "J", "⠅": "K", "⠇": "L",
      "⠍": "M", "⠝": "N", "⠕": "O", "⠏": "P", "⠟": "Q", "⠗": "R",
      "⠎": "S", "⠞": "T", "⠥": "U", "⠧": "V", "⠺": "W", "⠭": "X",
      "⠽": "Y", "⠵": "Z", " ": " "
    };

    const converted = brailleInput
      .split("")
      .map(char => textMap[char] || char)
      .join("");

    setTextOutput(converted);
    toast({
      title: "Conversion Complete",
      description: "Braille has been converted to text successfully.",
    });
  };

  const handleBrailleToSpeech = () => {
    if (!textOutput.trim()) {
      toast({
        title: "No text to speak",
        description: "Please convert Braille to text first.",
        variant: "destructive",
      });
      return;
    }

    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textOutput);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    
    toast({
      title: "Playing Audio",
      description: "Converting text to speech...",
    });
  };

  const handleKeyboardKeyClick = (char: string) => {
    if (char === "BACKSPACE") {
      setBrailleInput(prev => prev.slice(0, -1));
    } else {
      setBrailleInput(prev => prev + char);
    }
  };

  return (
    <>
      {showKeyboard && (
        <BrailleQwertyKeyboard
          onKeyClick={handleKeyboardKeyClick}
          onClose={() => setShowKeyboard(false)}
        />
      )}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Braille Input Section */}
      <Card className="p-8 bg-gradient-card shadow-soft border-0">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Braille Input</h2>
        
        {/* Virtual Braille Keyboard */}
        <div className="space-y-6 mb-6">
          <label className="block text-sm font-medium text-foreground">
            Virtual Braille Keyboard
          </label>
          
          <div className="bg-muted/20 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4 max-w-32 mx-auto">
              {/* Left column - dots 1, 2, 3 */}
              <div className="space-y-4">
                <BrailleDot position={1} isPressed={activeDots[0]} onPress={() => toggleDot(0)} />
                <BrailleDot position={2} isPressed={activeDots[1]} onPress={() => toggleDot(1)} />
                <BrailleDot position={3} isPressed={activeDots[2]} onPress={() => toggleDot(2)} />
              </div>
              
              {/* Right column - dots 4, 5, 6 */}
              <div className="space-y-4">
                <BrailleDot position={4} isPressed={activeDots[3]} onPress={() => toggleDot(3)} />
                <BrailleDot position={5} isPressed={activeDots[4]} onPress={() => toggleDot(4)} />
                <BrailleDot position={6} isPressed={activeDots[5]} onPress={() => toggleDot(5)} />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6 justify-center">
              <Button 
                onClick={addBrailleCharacter}
                className="btn-uniform"
              >
                Add Character
              </Button>
              <Button 
                onClick={clearInput}
                variant="outline"
                className="btn-uniform"
              >
                Clear
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Click the dots to form Braille characters, then add them to your input.
          </p>
        </div>

        {/* Braille Input Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="brailleInput" className="block text-sm font-medium text-foreground">
              Braille Input
            </label>
            <Button
              onClick={() => setShowKeyboard(!showKeyboard)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Keyboard className="h-4 w-4" />
              {showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
            </Button>
          </div>
          <Textarea
            id="brailleInput"
            value={brailleInput}
            onChange={(e) => setBrailleInput(e.target.value)}
            placeholder="Braille characters will appear here..."
            className="min-h-[120px] text-xl font-mono resize-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Text Output Section */}
      <Card className="p-8 bg-gradient-card shadow-soft border-0">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Text Output</h2>
        
        {/* Text Display */}
        <div className="space-y-4 mb-8">
          <label htmlFor="textOutput" className="block text-sm font-medium text-foreground">
            Translated Text
          </label>
          <Textarea
            id="textOutput"
            value={textOutput}
            readOnly
            placeholder="English text will appear here..."
            className="min-h-[120px] text-base resize-none bg-muted/30 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <Button
            onClick={handleBrailleToText}
            className="btn-uniform flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Braille to Text
          </Button>
          
          <Button
            onClick={handleBrailleToSpeech}
            variant="outline"
            className="btn-uniform flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Braille to Speech
          </Button>
        </div>
      </Card>
      </div>
    </>
  );
};