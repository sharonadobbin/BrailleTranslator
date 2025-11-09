import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2, RotateCcw, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

const brailleNumbers: BrailleCharacter[] = [
  { letter: "1", braille: "⠁", dots: [1] },
  { letter: "2", braille: "⠃", dots: [1, 2] },
  { letter: "3", braille: "⠉", dots: [1, 4] },
  { letter: "4", braille: "⠙", dots: [1, 4, 5] },
  { letter: "5", braille: "⠑", dots: [1, 5] },
  { letter: "6", braille: "⠋", dots: [1, 2, 4] },
  { letter: "7", braille: "⠛", dots: [1, 2, 4, 5] },
  { letter: "8", braille: "⠓", dots: [1, 2, 5] },
  { letter: "9", braille: "⠊", dots: [2, 4] },
  { letter: "0", braille: "⠚", dots: [2, 4, 5] },
];

type ViewMode = 'learn' | 'quiz';
type Category = 'letters' | 'numbers';

export const BrailleTutorTab = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<Category>('letters');
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  const [score, setScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const { toast } = useToast();

  const currentData = currentCategory === 'letters' ? brailleAlphabet : brailleNumbers;
  const currentCharacter = currentData[currentIndex];
  const progress = ((currentIndex + 1) / currentData.length) * 100;

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuizOptions();
    }
  }, [currentIndex, viewMode]);

  const generateQuizOptions = () => {
    const correct = currentCharacter.letter;
    const options = [correct];
    
    while (options.length < 4) {
      const randomChar = currentData[Math.floor(Math.random() * currentData.length)];
      if (!options.includes(randomChar.letter)) {
        options.push(randomChar.letter);
      }
    }
    
    setQuizOptions(options.sort(() => Math.random() - 0.5));
    setQuizAnswered(false);
    setSelectedAnswer("");
  };

  const speakLetter = (letter: string) => {
    if ('speechSynthesis' in window) {
      const isNumber = currentCategory === 'numbers';
      const utterance = new SpeechSynthesisUtterance(
        isNumber ? `The number ${letter}` : `The letter ${letter}`
      );
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < currentData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setQuizAnswered(false);
      setSelectedAnswer("");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setQuizAnswered(false);
      setSelectedAnswer("");
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizAnswered) return;
    
    setSelectedAnswer(answer);
    setQuizAnswered(true);
    
    if (answer === currentCharacter.letter) {
      setScore(score + 1);
      const isNumber = currentCategory === 'numbers';
      toast({
        title: "Correct! 🎉",
        description: `Well done! The ${isNumber ? 'number' : 'letter'} is ${currentCharacter.letter}.`,
      });
    } else {
      const isNumber = currentCategory === 'numbers';
      toast({
        title: "Not quite right",
        description: `The correct answer is ${currentCharacter.letter}. Keep practicing!`,
        variant: "destructive",
      });
    }
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setScore(0);
    setViewMode('learn');
    setQuizAnswered(false);
    setSelectedAnswer("");
    toast({
      title: "Progress Reset",
      description: "Starting fresh from the beginning!",
    });
  };

  const switchCategory = (category: Category) => {
    setCurrentCategory(category);
    setCurrentIndex(0);
    setScore(0);
    setViewMode('learn');
    setQuizAnswered(false);
    setSelectedAnswer("");
    toast({
      title: `Switched to ${category === 'letters' ? 'Letters' : 'Numbers'}`,
      description: `Now learning ${category === 'letters' ? 'A-Z' : '0-9'}!`,
    });
  };

  const renderBrailleDots = (dots: number[]) => {
    return (
      <div className="grid grid-cols-2 gap-3 mx-auto max-w-20">
        {/* Left column - dots 1, 2, 3 */}
        <div className="space-y-3">
          {[1, 2, 3].map(dotNumber => (
            <div
              key={dotNumber}
              className={`w-6 h-6 rounded-full border-2 ${
                dots.includes(dotNumber)
                  ? 'bg-primary border-primary shadow-lg'
                  : 'bg-background border-muted-foreground/30'
              }`}
              aria-label={`Dot ${dotNumber}${dots.includes(dotNumber) ? ' (filled)' : ' (empty)'}`}
            />
          ))}
        </div>
        
        {/* Right column - dots 4, 5, 6 */}
        <div className="space-y-3">
          {[4, 5, 6].map(dotNumber => (
            <div
              key={dotNumber}
              className={`w-6 h-6 rounded-full border-2 ${
                dots.includes(dotNumber)
                  ? 'bg-primary border-primary shadow-lg'
                  : 'bg-background border-muted-foreground/30'
              }`}
              aria-label={`Dot ${dotNumber}${dots.includes(dotNumber) ? ' (filled)' : ' (empty)'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Braille Tutor</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Master the Braille alphabet with interactive lessons and quizzes
        </p>
        
        {/* Progress and Navigation */}
        <div className="flex items-center justify-center mb-6">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{currentIndex + 1} of {currentData.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={resetProgress}
            variant="outline"
            className="btn-uniform flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </Button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            onClick={() => switchCategory('letters')}
            variant={currentCategory === 'letters' ? 'default' : 'ghost'}
            className="btn-uniform"
          >
            Letters (A-Z)
          </Button>
          <Button
            onClick={() => switchCategory('numbers')}
            variant={currentCategory === 'numbers' ? 'default' : 'ghost'}
            className="btn-uniform"
          >
            Numbers (0-9)
          </Button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            onClick={() => setViewMode('learn')}
            variant={viewMode === 'learn' ? 'default' : 'ghost'}
            className="btn-uniform"
          >
            Learn Mode
          </Button>
          <Button
            onClick={() => setViewMode('quiz')}
            variant={viewMode === 'quiz' ? 'default' : 'ghost'}
            className="btn-uniform"
          >
            Quiz Mode
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="p-8 bg-gradient-card shadow-soft border-0 mb-8">
        {viewMode === 'learn' ? (
          // Learn Mode
          <div className="text-center">
            <div className="mb-8">
              <div className="text-8xl font-bold text-primary mb-4">
                {currentCharacter.letter}
              </div>
              <div className="text-6xl mb-6">
                {currentCharacter.braille}
              </div>
              
              {/* Braille Dot Pattern */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-foreground">Dot Pattern</h3>
                {renderBrailleDots(currentCharacter.dots)}
                <p className="text-sm text-muted-foreground mt-4">
                  Dots: {currentCharacter.dots.join(', ')}
                </p>
              </div>
            </div>

            <Button
              onClick={() => speakLetter(currentCharacter.letter)}
              variant="outline"
              className="btn-uniform flex items-center gap-2 mx-auto mb-8"
            >
              <Volume2 className="w-4 h-4" />
              Pronounce {currentCategory === 'numbers' ? 'Number' : 'Letter'}
            </Button>
          </div>
        ) : (
          // Quiz Mode
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                What {currentCategory === 'numbers' ? 'number' : 'letter'} does this represent?
              </h3>
              
              <div className="text-6xl mb-6">
                {currentCharacter.braille}
              </div>
              
              {/* Braille Dot Pattern */}
              <div className="mb-8">
                {renderBrailleDots(currentCharacter.dots)}
              </div>
            </div>

            {/* Quiz Options */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              {quizOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuizAnswer(option)}
                  variant={
                    quizAnswered
                      ? option === currentCharacter.letter
                        ? 'default'
                        : option === selectedAnswer
                        ? 'destructive'
                        : 'outline'
                      : 'outline'
                  }
                  className="btn-uniform text-2xl h-16"
                  disabled={quizAnswered}
                >
                  {option}
                </Button>
              ))}
            </div>

            {quizAnswered && (
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Score: {score} / {currentIndex + 1}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="btn-uniform"
          >
            Previous
          </Button>
          
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {currentData.length}
            </span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentIndex === currentData.length - 1}
            className="btn-uniform flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Summary Card */}
      {viewMode === 'quiz' && (
        <Card className="p-6 bg-gradient-card shadow-soft border-0">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2 text-foreground">Quiz Progress</h3>
            <p className="text-2xl font-bold text-primary">
              {score} / {currentIndex + 1}
            </p>
            <p className="text-muted-foreground">
              {Math.round((score / Math.max(currentIndex + 1, 1)) * 100)}% correct
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};