import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Minimize2, Maximize2 } from "lucide-react";

interface BrailleQwertyKeyboardProps {
  onKeyClick: (char: string) => void;
  onClose: () => void;
}

interface KeyData {
  label: string;
  braille: string;
  char: string;
  width?: number;
}

const keyboardLayout: KeyData[][] = [
  [
    { label: "~", braille: "⠈⠔", char: "⠈⠔" },
    { label: "!", braille: "⠖", char: "⠖" },
    { label: "@", braille: "⠈⠁", char: "⠈⠁" },
    { label: "#", braille: "⠼⠼", char: "⠼⠼" },
    { label: "$", braille: "⠫", char: "⠫" },
    { label: "%", braille: "⠩", char: "⠩" },
    { label: "sh", braille: "⠩", char: "⠩" },
    { label: "and", braille: "⠯", char: "⠯" },
    { label: "*", braille: "⠐⠔", char: "⠐⠔" },
    { label: "[", braille: "⠈⠷", char: "⠈⠷" },
    { label: "]", braille: "⠈⠾", char: "⠈⠾" },
    { label: "|", braille: "⠳", char: "⠳" },
    { label: "+", braille: "⠬", char: "⠬" },
    { label: "Delete", braille: "", char: "DELETE", width: 2 },
  ],
  [
    { label: "#", braille: "⠼", char: "⠼" },
    { label: "1", braille: "⠁", char: "⠼⠁" },
    { label: "2", braille: "⠃", char: "⠼⠃" },
    { label: "3", braille: "⠉", char: "⠼⠉" },
    { label: "4", braille: "⠙", char: "⠼⠙" },
    { label: "5", braille: "⠑", char: "⠼⠑" },
    { label: "6", braille: "⠋", char: "⠼⠋" },
    { label: "7", braille: "⠛", char: "⠼⠛" },
    { label: "8", braille: "⠓", char: "⠼⠓" },
    { label: "9", braille: "⠊", char: "⠼⠊" },
    { label: "0", braille: "⠚", char: "⠼⠚" },
    { label: "-", braille: "⠤", char: "⠤" },
    { label: "=", braille: "⠶", char: "⠶" },
    { label: "ing", braille: "⠬", char: "⠬", width: 2 },
  ],
  [
    { label: "Tab", braille: "", char: "\t", width: 1.5 },
    { label: "Q", braille: "⠟", char: "⠟" },
    { label: "W", braille: "⠺", char: "⠺" },
    { label: "E", braille: "⠑", char: "⠑" },
    { label: "R", braille: "⠗", char: "⠗" },
    { label: "T", braille: "⠞", char: "⠞" },
    { label: "Y", braille: "⠽", char: "⠽" },
    { label: "U", braille: "⠥", char: "⠥" },
    { label: "I", braille: "⠊", char: "⠊" },
    { label: "O", braille: "⠕", char: "⠕" },
    { label: "P", braille: "⠏", char: "⠏" },
    { label: "()", braille: "⠶", char: "⠶" },
    { label: "'", braille: "⠄", char: "⠄" },
    { label: "\\", braille: "⠳", char: "⠳" },
  ],
  [
    { label: "Caps Lock", braille: "⠠⠠", char: "⠠⠠", width: 2 },
    { label: "A", braille: "⠁", char: "⠁" },
    { label: "S", braille: "⠎", char: "⠎" },
    { label: "D", braille: "⠙", char: "⠙" },
    { label: "F", braille: "⠋", char: "⠋" },
    { label: "G", braille: "⠛", char: "⠛" },
    { label: "H", braille: "⠓", char: "⠓" },
    { label: "J", braille: "⠚", char: "⠚" },
    { label: "K", braille: "⠅", char: "⠅" },
    { label: "L", braille: "⠇", char: "⠇" },
    { label: ";", braille: "⠆", char: "⠆" },
    { label: ":", braille: "⠒", char: "⠒" },
    { label: "Enter", braille: "", char: "\n", width: 2 },
  ],
  [
    { label: "Upper Case", braille: "⠠", char: "⠠", width: 2 },
    { label: "Z", braille: "⠵", char: "⠵" },
    { label: "X", braille: "⠭", char: "⠭" },
    { label: "C", braille: "⠉", char: "⠉" },
    { label: "V", braille: "⠧", char: "⠧" },
    { label: "B", braille: "⠃", char: "⠃" },
    { label: "N", braille: "⠝", char: "⠝" },
    { label: "M", braille: "⠍", char: "⠍" },
    { label: ",", braille: "⠂", char: "⠂" },
    { label: ".", braille: "⠲", char: "⠲" },
    { label: "/", braille: "⠌", char: "⠌" },
    { label: "Letter Prefix", braille: "⠰", char: "⠰", width: 2 },
  ],
  [
    { label: "th", braille: "⠹", char: "⠹" },
    { label: "ch", braille: "⠡", char: "⠡" },
    { label: "wh", braille: "⠱", char: "⠱" },
    { label: "gh", braille: "⠣", char: "⠣" },
    { label: "ar", braille: "⠜", char: "⠜" },
    { label: "ow", braille: "⠪", char: "⠪" },
    { label: "ou", braille: "⠳", char: "⠳" },
    { label: "of", braille: "⠷", char: "⠷" },
    { label: "in", braille: "⠔", char: "⠔" },
    { label: "ed", braille: "⠫", char: "⠫" },
    { label: "en", braille: "⠢", char: "⠢" },
    { label: "er", braille: "⠻", char: "⠻" },
    { label: "st", braille: "⠌", char: "⠌" },
    { label: "?", braille: "⠦", char: "⠦" },
    { label: '"', braille: "⠶", char: "⠶" },
  ],
  [
    { label: "the", braille: "⠮", char: "⠮" },
    { label: "\\5/", braille: "⠡", char: "⠡" },
    { label: "\\456/", braille: "⠱", char: "⠱" },
    { label: "Space", braille: "", char: " ", width: 6 },
    { label: "\\46/", braille: "⠣", char: "⠣" },
    { label: "\\4/", braille: "⠜", char: "⠜" },
    { label: "for", braille: "⠿", char: "⠿" },
    { label: "with", braille: "⠾", char: "⠾" },
  ],
];

export const BrailleQwertyKeyboard = ({ onKeyClick, onClose }: BrailleQwertyKeyboardProps) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".keyboard-header")) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleKeyPress = (key: KeyData) => {
    if (key.char === "DELETE") {
      onKeyClick("BACKSPACE");
    } else {
      onKeyClick(key.char);
    }
  };

  return (
    <div
      ref={keyboardRef}
      className="fixed z-50 bg-background shadow-2xl rounded-lg overflow-hidden transition-transform duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        border: "2px solid #ff0066",
        transform: isMinimized ? "scale(0.5)" : "scale(1)",
        transformOrigin: "top left",
      }}
    >
      {/* Header */}
      <div
        className="keyboard-header bg-[#ff0066] text-white px-4 py-2 flex items-center justify-between cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="font-semibold">Braille Keyboard</span>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-6 px-2"
          >
            {isMinimized ? (
              <>
                <Maximize2 className="h-3 w-3 mr-1" />
                [Maximize]
              </>
            ) : (
              <>
                <Minimize2 className="h-3 w-3 mr-1" />
                [Minimize]
              </>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-6 px-2"
          >
            [Hide]
          </Button>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="Close keyboard"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Keyboard */}
      <div className="p-4 bg-[#e8e8e8]" style={{ minWidth: "900px" }}>
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 mb-1">
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                onClick={() => handleKeyPress(key)}
                className="bg-white hover:bg-gray-50 transition-colors rounded flex flex-col items-center justify-center py-2 px-1 text-xs font-medium relative"
                style={{
                  border: "1px solid #ff0066",
                  minWidth: key.width ? `${key.width * 60}px` : "60px",
                  minHeight: "50px",
                }}
              >
                <div className="text-gray-700 mb-1">{key.label}</div>
                {key.braille && (
                  <div className="text-base font-mono" style={{ fontSize: "14px" }}>
                    {key.braille}
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
