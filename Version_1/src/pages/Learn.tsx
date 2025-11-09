import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Braille patterns for letters A-Z
const brailleAlphabet = {
  A: "⠁", B: "⠃", C: "⠉", D: "⠙", E: "⠑", F: "⠋", G: "⠛", H: "⠓", I: "⠊", J: "⠚",
  K: "⠅", L: "⠇", M: "⠍", N: "⠝", O: "⠕", P: "⠏", Q: "⠟", R: "⠗", S: "⠎", T: "⠞",
  U: "⠥", V: "⠧", W: "⠺", X: "⠭", Y: "⠽", Z: "⠵"
};

// Braille patterns for numbers 0-9
const brailleNumbers = {
  "1": "⠁", "2": "⠃", "3": "⠉", "4": "⠙", "5": "⠑", 
  "6": "⠋", "7": "⠛", "8": "⠓", "9": "⠊", "0": "⠚"
};

// Combine letters and numbers
const allCharacters = { ...brailleAlphabet, ...brailleNumbers };
const letters = Object.keys(brailleAlphabet);
const numbers = Object.keys(brailleNumbers);
const allItems = [...letters, ...numbers];

export default function Learn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentMode, setCurrentMode] = useState<'learn' | 'quiz'>('learn');
  const [currentCategory, setCurrentCategory] = useState<'letters' | 'numbers'>('letters');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [shuffledQuizItems, setShuffledQuizItems] = useState<string[]>([]);

  const currentItems = currentMode === 'quiz' && shuffledQuizItems.length > 0 
    ? shuffledQuizItems 
    : (currentCategory === 'letters' ? letters : numbers);
  const currentItem = currentItems[currentLetterIndex];
  const progress = ((currentLetterIndex + 1) / currentItems.length) * 100;

  // Generate quiz options
  useEffect(() => {
    if (currentMode === 'quiz' && currentItem) {
      const correct = currentItem;
      const allOptions = currentCategory === 'letters' ? letters : numbers;
      const incorrect = allOptions.filter(l => l !== correct).slice(0, 3);
      const options = [correct, ...incorrect].sort(() => Math.random() - 0.5);
      setQuizOptions(options);
      setSelectedAnswer("");
      setShowResult(false);
    }
  }, [currentLetterIndex, currentMode, currentItem, currentCategory]);

  const handleNext = () => {
    if (currentMode === 'quiz' && !showResult) {
      // Don't advance in quiz mode until question is answered
      return;
    }
    
    if (currentLetterIndex < currentItems.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      if (currentMode === 'quiz') {
        setShowResult(false);
        setSelectedAnswer("");
      }
    } else if (currentMode === 'learn') {
      setCurrentMode('quiz');
      setCurrentLetterIndex(0);
      toast({
        title: "Learning Complete!",
        description: "Now let's test your knowledge with a quiz.",
      });
    } else if (currentMode === 'quiz') {
      // Quiz completed
      toast({
        title: "Quiz Complete!",
        description: `You scored ${score} out of ${currentItems.length}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentItem;
    const newHistory = [...quizHistory, isCorrect];
    setQuizHistory(newHistory);
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: `Well done! ${currentItem} is ${allCharacters[currentItem as keyof typeof allCharacters]}`,
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer is ${currentItem}`,
        variant: "destructive",
      });
    }
  };

  const resetQuiz = () => {
    setCurrentLetterIndex(0);
    setScore(0);
    setQuizHistory([]);
    setCurrentMode('learn');
    setShuffledQuizItems([]);
  };

  const switchCategory = (category: 'letters' | 'numbers') => {
    setCurrentCategory(category);
    setCurrentLetterIndex(0);
    setScore(0);
    setQuizHistory([]);
    setCurrentMode('learn');
    setShuffledQuizItems([]);
  };

  // Shuffle items when entering quiz mode
  useEffect(() => {
    if (currentMode === 'quiz') {
      const itemsToShuffle = currentCategory === 'letters' ? letters : numbers;
      const shuffled = [...itemsToShuffle].sort(() => Math.random() - 0.5);
      setShuffledQuizItems(shuffled);
      setCurrentLetterIndex(0);
      setScore(0);
      setQuizHistory([]);
    } else {
      setShuffledQuizItems([]);
    }
  }, [currentMode, currentCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Translator
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Learn Braille</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {currentMode === 'learn' ? 'Learning Mode' : 'Quiz Mode'}
              </Badge>
              {currentMode === 'quiz' && (
                <Badge variant="outline" className="text-sm">
                  Score: {score}/{Math.max(quizHistory.length, 1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Category Selection */}
          <Card className="p-4">
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => switchCategory('letters')}
                variant={currentCategory === 'letters' ? 'default' : 'outline'}
                className="flex-1"
              >
                Letters (A-Z)
              </Button>
              <Button
                onClick={() => switchCategory('numbers')}
                variant={currentCategory === 'numbers' ? 'default' : 'outline'}
                className="flex-1"
              >
                Numbers (0-9)
              </Button>
            </div>
          </Card>

          {/* Progress */}
          <Card className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress ({currentCategory === 'letters' ? 'Letters' : 'Numbers'})</span>
                <span>{currentLetterIndex + 1} of {currentItems.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </Card>

          {/* Learning Content */}
          {currentMode === 'learn' ? (
            <Card className="p-8 text-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  {currentCategory === 'letters' ? 'Letter' : 'Number'} {currentItem}
                </h2>
                <div className="text-8xl font-mono text-primary">
                  {allCharacters[currentItem as keyof typeof allCharacters]}
                </div>
                <p className="text-lg text-muted-foreground">
                  This is the Braille pattern for the {currentCategory === 'letters' ? 'letter' : 'number'} "{currentItem}"
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentLetterIndex === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button onClick={handleNext}>
                    {currentLetterIndex === currentItems.length - 1 ? 'Start Quiz' : 'Next'}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            /* Quiz Content */
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    What {currentCategory === 'letters' ? 'letter' : 'number'} is this?
                  </h2>
                  <div className="text-8xl font-mono text-primary mb-6">
                    {allCharacters[currentItem as keyof typeof allCharacters]}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {quizOptions.map((option) => (
                    <Button
                      key={option}
                      variant={
                        showResult
                          ? option === currentItem
                            ? 'default'
                            : option === selectedAnswer
                            ? 'destructive'
                            : 'outline'
                          : 'outline'
                      }
                      className="h-16 text-xl"
                      onClick={() => !showResult && handleQuizAnswer(option)}
                      disabled={showResult}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {showResult && (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      {selectedAnswer === currentItem ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500" />
                      )}
                      <span className="text-xl font-semibold">
                        {selectedAnswer === currentItem ? 'Correct!' : `Incorrect. The answer is ${currentItem}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation for Quiz */}
                <div className="flex gap-4 justify-center mt-6">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentLetterIndex === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!showResult}
                    variant={showResult ? "default" : "outline"}
                  >
                    {currentLetterIndex === currentItems.length - 1 ? 'Complete Quiz' : 'Next'}
                  </Button>
                </div>

                {currentLetterIndex === currentItems.length - 1 && showResult && (
                  <div className="text-center mt-4">
                    <Button onClick={resetQuiz} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Restart Learning
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Quiz Summary */}
          {currentMode === 'quiz' && quizHistory.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quiz Progress</h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Accuracy: {Math.min(Math.round((score / quizHistory.length) * 100), 100)}%
                </div>
                <div className="flex flex-wrap gap-2">
                  {quizHistory.map((correct, index) => (
                    <Badge
                      key={index}
                      variant={correct ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {shuffledQuizItems.length > 0 ? shuffledQuizItems[index] : currentItems[index]}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}