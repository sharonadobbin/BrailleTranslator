import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

interface BrailleCharacter {
  letter: string;
  braille: string;
  dots: number[];
}

const brailleAlphabet: BrailleCharacter[] = [
  { letter: "A", braille: "⠁", dots: [1] },
  { letter: "B", braille: "⠃", dots: [1, 2] },
  { letter: "C", braille: "⠉", dots: [1, 4] },
  { letter: "D", braille: "⠙", dots: [1, 4, 5] },
  { letter: "E", braille: "⠑", dots: [1, 5] },
  { letter: "F", braille: "⠋", dots: [1, 2, 4] },
  { letter: "G", braille: "⠛", dots: [1, 2, 4, 5] },
  { letter: "H", braille: "⠓", dots: [1, 2, 5] },
  { letter: "I", braille: "⠊", dots: [2, 4] },
  { letter: "J", braille: "⠚", dots: [2, 4, 5] },
  { letter: "K", braille: "⠅", dots: [1, 3] },
  { letter: "L", braille: "⠇", dots: [1, 2, 3] },
  { letter: "M", braille: "⠍", dots: [1, 3, 4] },
  { letter: "N", braille: "⠝", dots: [1, 3, 4, 5] },
  { letter: "O", braille: "⠕", dots: [1, 3, 5] },
  { letter: "P", braille: "⠏", dots: [1, 2, 3, 4] },
  { letter: "Q", braille: "⠟", dots: [1, 2, 3, 4, 5] },
  { letter: "R", braille: "⠗", dots: [1, 2, 3, 5] },
  { letter: "S", braille: "⠎", dots: [2, 3, 4] },
  { letter: "T", braille: "⠞", dots: [2, 3, 4, 5] },
  { letter: "U", braille: "⠥", dots: [1, 3, 6] },
  { letter: "V", braille: "⠧", dots: [1, 2, 3, 6] },
  { letter: "W", braille: "⠺", dots: [2, 4, 5, 6] },
  { letter: "X", braille: "⠭", dots: [1, 3, 4, 6] },
  { letter: "Y", braille: "⠽", dots: [1, 3, 4, 5, 6] },
  { letter: "Z", braille: "⠵", dots: [1, 3, 5, 6] },
];

export const BrailleAnimationTab = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [visibleDots, setVisibleDots] = useState<number[]>([]);

  const currentCharacter = brailleAlphabet[currentIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && animationStep < currentCharacter.dots.length) {
      interval = setTimeout(() => {
        const nextDot = currentCharacter.dots[animationStep];
        setVisibleDots(prev => [...prev, nextDot]);
        setAnimationStep(prev => prev + 1);
      }, 800);
    } else if (isPlaying && animationStep >= currentCharacter.dots.length) {
      // Animation complete, pause
      setTimeout(() => {
        setIsPlaying(false);
      }, 1000);
    }

    return () => clearTimeout(interval);
  }, [isPlaying, animationStep, currentCharacter.dots.length]);

  const startAnimation = () => {
    setAnimationStep(0);
    setVisibleDots([]);
    setIsPlaying(true);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setAnimationStep(0);
    setVisibleDots([]);
  };

  const nextCharacter = () => {
    if (currentIndex < brailleAlphabet.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetAnimation();
    }
  };

  const previousCharacter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetAnimation();
    }
  };

  const renderAnimatedBrailleDots = () => {
    return (
      <div className="grid grid-cols-2 gap-4 mx-auto max-w-24">
        {/* Left column - dots 1, 2, 3 */}
        <div className="space-y-4">
          {[1, 2, 3].map(dotNumber => {
            const isVisible = visibleDots.includes(dotNumber);
            const isTarget = currentCharacter.dots.includes(dotNumber);
            const isNext = !isVisible && isTarget && currentCharacter.dots[animationStep] === dotNumber;
            
            return (
              <div
                key={dotNumber}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-500 ${
                  isVisible && isTarget
                    ? 'bg-primary border-primary shadow-lg scale-110'
                    : isNext && isPlaying
                    ? 'bg-primary/50 border-primary animate-pulse scale-105'
                    : isTarget
                    ? 'bg-muted border-muted-foreground/50'
                    : 'bg-background border-muted-foreground/30'
                }`}
              />
            );
          })}
        </div>
        
        {/* Right column - dots 4, 5, 6 */}
        <div className="space-y-4">
          {[4, 5, 6].map(dotNumber => {
            const isVisible = visibleDots.includes(dotNumber);
            const isTarget = currentCharacter.dots.includes(dotNumber);
            const isNext = !isVisible && isTarget && currentCharacter.dots[animationStep] === dotNumber;
            
            return (
              <div
                key={dotNumber}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-500 ${
                  isVisible && isTarget
                    ? 'bg-primary border-primary shadow-lg scale-110'
                    : isNext && isPlaying
                    ? 'bg-primary/50 border-primary animate-pulse scale-105'
                    : isTarget
                    ? 'bg-muted border-muted-foreground/50'
                    : 'bg-background border-muted-foreground/30'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Braille Animation</h1>
        <p className="text-lg text-muted-foreground">
          Watch how Braille characters form dot by dot
        </p>
      </div>

      {/* Main Animation Card */}
      <Card className="p-8 bg-gradient-card shadow-soft border-0">
        <div className="text-center space-y-8">
          {/* Character Display */}
          <div>
            <div className="text-6xl font-bold text-primary mb-2">
              {currentCharacter.letter}
            </div>
            <div className="text-4xl mb-4">
              {currentCharacter.braille}
            </div>
            <Badge variant="secondary" className="text-sm">
              Letter {currentIndex + 1} of {brailleAlphabet.length}
            </Badge>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center mb-8">
            {renderAnimatedBrailleDots()}
          </div>

          {/* Animation Info */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-foreground">
              Dots: {currentCharacter.dots.join(', ')}
            </div>
            
            {isPlaying && animationStep < currentCharacter.dots.length && (
              <div className="text-primary font-medium">
                Adding dot {currentCharacter.dots[animationStep]}...
              </div>
            )}
            
            {animationStep >= currentCharacter.dots.length && visibleDots.length > 0 && (
              <div className="text-green-600 font-medium">
                ✓ Character complete!
              </div>
            )}
          </div>

          {/* Animation Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={isPlaying ? pauseAnimation : startAnimation}
              className="btn-uniform flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {animationStep === 0 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
            
            <Button
              onClick={resetAnimation}
              variant="outline"
              className="btn-uniform flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button
              onClick={previousCharacter}
              disabled={currentIndex === 0}
              variant="outline"
              className="btn-uniform flex items-center gap-2"
            >
              <SkipBack className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {brailleAlphabet.length}
              </span>
            </div>
            
            <Button
              onClick={nextCharacter}
              disabled={currentIndex === brailleAlphabet.length - 1}
              className="btn-uniform flex items-center gap-2"
            >
              Next
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-gradient-card border-0 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>Watch:</strong> See dots appear one by one in the correct order
            </div>
            <div>
              <strong>Learn:</strong> Understand the formation pattern of each character
            </div>
            <div>
              <strong>Practice:</strong> Use the controls to replay animations
            </div>
            <div>
              <strong>Navigate:</strong> Move between letters to explore the alphabet
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};