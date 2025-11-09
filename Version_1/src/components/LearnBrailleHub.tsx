import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Keyboard, Play, ArrowLeft } from "lucide-react";
import { BrailleTutorTab } from "./BrailleTutorTab";
import { TypingTrainerTab } from "./TypingTrainerTab";
import { BrailleAnimationTab } from "./BrailleAnimationTab";

type Module = 'hub' | 'tutor' | 'trainer' | 'animation';

export const LearnBrailleHub = () => {
  const [activeModule, setActiveModule] = useState<Module>('hub');

  const modules = [
    {
      id: 'tutor' as Module,
      title: 'Braille Tutor',
      description: 'Interactive quizzes for letters A-Z and numbers 0-9',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'trainer' as Module,
      title: 'Typing Trainer',
      description: 'Practice typing Braille with a 6-key virtual keyboard',
      icon: Keyboard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'animation' as Module,
      title: 'Braille Animation',
      description: 'Watch dot-by-dot visualizations of character formation',
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (activeModule === 'tutor') {
    return (
      <div>
        <div className="mb-6">
          <Button
            onClick={() => setActiveModule('hub')}
            variant="outline"
            className="btn-uniform flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learn Hub
          </Button>
        </div>
        <BrailleTutorTab />
      </div>
    );
  }

  if (activeModule === 'trainer') {
    return (
      <div>
        <div className="mb-6">
          <Button
            onClick={() => setActiveModule('hub')}
            variant="outline"
            className="btn-uniform flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learn Hub
          </Button>
        </div>
        <TypingTrainerTab />
      </div>
    );
  }

  if (activeModule === 'animation') {
    return (
      <div>
        <div className="mb-6">
          <Button
            onClick={() => setActiveModule('hub')}
            variant="outline"
            className="btn-uniform flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learn Hub
          </Button>
        </div>
        <BrailleAnimationTab />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Learn Braille</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master Braille through interactive learning modules designed for all skill levels
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card 
              key={module.id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-medium border-0 bg-gradient-card flex flex-col h-full"
              onClick={() => setActiveModule(module.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${module.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${module.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-col flex-grow justify-between">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {module.description}
                </p>
                <Button 
                  className="btn-uniform w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModule(module.id);
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center">
        <Card className="p-8 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Why Learn Braille?
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Braille is a tactile writing system that opens doors to literacy and independence. 
            Our interactive modules help you understand the dot patterns, practice typing skills, 
            and visualize how each character is formed step by step.
          </p>
        </Card>
      </div>
    </div>
  );
};