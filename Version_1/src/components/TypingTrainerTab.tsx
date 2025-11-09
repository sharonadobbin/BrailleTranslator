import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, RotateCcw } from "lucide-react";

// Braille mapping for letters and numbers
const brailleMap = {
  'a': [1], 'b': [1,2], 'c': [1,4], 'd': [1,4,5], 'e': [1,5], 'f': [1,2,4], 'g': [1,2,4,5], 'h': [1,2,5],
  'i': [2,4], 'j': [2,4,5], 'k': [1,3], 'l': [1,2,3], 'm': [1,3,4], 'n': [1,3,4,5], 'o': [1,3,5],
  'p': [1,2,3,4], 'q': [1,2,3,4,5], 'r': [1,2,3,5], 's': [2,3,4], 't': [2,3,4,5], 'u': [1,3,6],
  'v': [1,2,3,6], 'w': [2,4,5,6], 'x': [1,3,4,6], 'y': [1,3,4,5,6], 'z': [1,3,5,6],
  '1': [1], '2': [1,2], '3': [1,4], '4': [1,4,5], '5': [1,5], '6': [1,2,4], '7': [1,2,4,5], '8': [1,2,5], '9': [2,4], '0': [2,4,5]
};

const exercises = [
  { type: 'letters', items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] },
  { type: 'numbers', items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] },
  { type: 'words', items: ['cat', 'dog', 'sun', 'fun', 'big', 'red', 'go', 'me'] }
];

export function TypingTrainerTab() {
  const [activeDots, setActiveDots] = useState<number[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const [currentTarget, setCurrentTarget] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const getCurrentExercise = () => exercises[currentExercise];
  
  useEffect(() => {
    if (gameStarted) {
      const exercise = getCurrentExercise();
      setCurrentTarget(exercise.items[currentItem]);
    }
  }, [currentExercise, currentItem, gameStarted]);

  const toggleDot = useCallback((dot: number) => {
    setActiveDots(prev => 
      prev.includes(dot) 
        ? prev.filter(d => d !== dot)
        : [...prev, dot].sort()
    );
  }, []);

  const clearDots = useCallback(() => {
    setActiveDots([]);
  }, []);

  const getBrailleCharacter = (dots: number[]) => {
    const entry = Object.entries(brailleMap).find(([_, pattern]) => 
      pattern.length === dots.length && pattern.every(dot => dots.includes(dot))
    );
    return entry ? entry[0] : '';
  };

  const renderBrailleDots = (dots: number[], isActive = false) => {
    return (
      <div className="grid grid-cols-2 gap-1 w-12 h-18 mx-auto">
        {[1, 2, 3, 4, 5, 6].map(dot => (
          <div
            key={dot}
            className={`w-4 h-4 rounded-full border-2 ${
              dots.includes(dot) 
                ? 'bg-primary border-primary' 
                : isActive && activeDots.includes(dot)
                ? 'bg-primary/70 border-primary'
                : 'bg-background border-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  const checkAnswer = () => {
    if (!gameStarted) return;
    
    const targetDots = brailleMap[currentTarget.toLowerCase()];
    const isCorrect = targetDots && 
      activeDots.length === targetDots.length && 
      activeDots.every(dot => targetDots.includes(dot));
    
    setTotalAttempts(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 10 + (streak * 2));
      setStreak(prev => prev + 1);
      setFeedback("Correct! 🎉");
      
      setTimeout(() => {
        const exercise = getCurrentExercise();
        if (currentItem < exercise.items.length - 1) {
          setCurrentItem(prev => prev + 1);
        } else {
          if (currentExercise < exercises.length - 1) {
            setCurrentExercise(prev => prev + 1);
            setCurrentItem(0);
          } else {
            setFeedback("Congratulations! You completed all exercises! 🏆");
            return;
          }
        }
        setFeedback("");
        clearDots();
      }, 1000);
    } else {
      setStreak(0);
      setFeedback(`Incorrect. Try again! 💪`);
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalAttempts(0);
    setStreak(0);
    setCurrentExercise(0);
    setCurrentItem(0);
    setFeedback("");
    clearDots();
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setTotalAttempts(0);
    setStreak(0);
    setCurrentExercise(0);
    setCurrentItem(0);
    setFeedback("");
    clearDots();
  };

  const accuracy = totalAttempts > 0 ? Math.round((score / 10 / totalAttempts) * 100) : 0;
  const progress = gameStarted ? ((currentExercise * 10 + currentItem) / (exercises.length * 10)) * 100 : 0;

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Star className="h-6 w-6 text-yellow-500" />
                Braille Typing Trainer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Learn to type Braille using a 6-key virtual keyboard. Practice letters, numbers, and words 
                while earning points and improving your accuracy!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-primary/20">
                  <h3 className="font-semibold mb-2">Letters (A-J)</h3>
                  <p className="text-sm text-muted-foreground">Master the basic alphabet</p>
                </Card>
                <Card className="p-4 border-primary/20">
                  <h3 className="font-semibold mb-2">Numbers (0-9)</h3>
                  <p className="text-sm text-muted-foreground">Practice number combinations</p>
                </Card>
                <Card className="p-4 border-primary/20">
                  <h3 className="font-semibold mb-2">Words</h3>
                  <p className="text-sm text-muted-foreground">Type complete words</p>
                </Card>
              </div>
              <Button onClick={startGame} size="lg" className="w-full max-w-md">
                Start Training 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Header */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Score: {score}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Accuracy: {accuracy}%
            </Badge>
            {streak > 0 && (
              <Badge variant="default" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Streak: {streak}
              </Badge>
            )}
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {getCurrentExercise().type.toUpperCase()} - Exercise {currentExercise + 1}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Main Game Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Target */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-sm">Type This</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-4xl font-bold text-primary">
                  {currentTarget.toUpperCase()}
                </div>
                {brailleMap[currentTarget] && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">Target Pattern:</span>
                    {renderBrailleDots(brailleMap[currentTarget])}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-sm">Your Input</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-3xl font-bold">
                  {getBrailleCharacter(activeDots).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">Your Pattern:</span>
                  {renderBrailleDots(activeDots, true)}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={checkAnswer} disabled={activeDots.length === 0} size="sm">
                    Submit
                  </Button>
                  <Button variant="outline" onClick={clearDots} size="sm">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-sm">Feedback</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                {feedback ? (
                  <div className={`text-lg font-semibold ${
                    feedback.includes('Correct') ? 'text-green-600' : 
                    feedback.includes('Congratulations') ? 'text-purple-600' :
                    'text-orange-600'
                  }`}>
                    {feedback}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Use the keyboard below to type the character
                  </div>
                )}
                <Button variant="outline" onClick={resetGame} size="sm" className="flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Virtual Keyboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">6-Key Braille Keyboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
                <div className="space-y-3">
                  <div className="text-center font-semibold text-sm">Left Hand</div>
                  {[1, 2, 3].map(dot => (
                    <Button
                      key={dot}
                      variant={activeDots.includes(dot) ? "default" : "outline"}
                      className="w-full h-12 text-sm font-bold"
                      onClick={() => toggleDot(dot)}
                    >
                      Dot {dot}
                    </Button>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-center font-semibold text-sm">Right Hand</div>
                  {[4, 5, 6].map(dot => (
                    <Button
                      key={dot}
                      variant={activeDots.includes(dot) ? "default" : "outline"}
                      className="w-full h-12 text-sm font-bold"
                      onClick={() => toggleDot(dot)}
                    >
                      Dot {dot}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}