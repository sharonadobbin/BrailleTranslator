import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

export const HeroSection = () => {
  return (
    <section className="relative py-2.5 px-6 bg-gradient-hero overflow-hidden">
      {/* Top Navigation */}
      <div className="container mx-auto max-w-7xl relative z-10 flex justify-between items-center mb-2">
        {/* Contact Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Contact
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background border shadow-lg">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sharon</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-background border shadow-lg">
                <DropdownMenuItem>Sharon A Dobbin (1AT22CS120)</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Shreya</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-background border shadow-lg">
                <DropdownMenuItem>P Shreya (1AT22CS069)</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sandhya</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-background border shadow-lg">
                <DropdownMenuItem>Sandhya S (1AT22CS085)</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Pooja</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-background border shadow-lg">
                <DropdownMenuItem>Pooja Vijay Bijapur (1AT23CS404)</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* GitHub Link */}
        <a 
          href="https://github.com/sharonadobbin/BrailleTranslator.git" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/b33b641a-d778-4729-9c87-5eda970abd4f.png" 
            alt="GitHub Repository" 
            className="w-8 h-8"
          />
        </a>
      </div>

      {/* Header Content */}
      <div className="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center justify-center min-h-[120px]">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
          Easy Braille Translator
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
          Transforming Text, Speech, and Images to Braille with AI
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 left-10 w-5 h-5 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-2 right-10 w-8 h-8 bg-white/5 rounded-full blur-2xl" />
    </section>
  );
};