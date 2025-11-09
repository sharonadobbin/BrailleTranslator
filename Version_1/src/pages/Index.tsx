import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextToBrailleTab } from "@/components/TextToBrailleTab";
import { BrailleToTextTab } from "@/components/BrailleToTextTab";
import { LearnBrailleHub } from "@/components/LearnBrailleHub";

import { DocumentParserTab } from "@/components/DocumentParserTab";
import { CameraBrailleTab } from "@/components/CameraBrailleTab";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("text-to-braille");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "learn") {
      setActiveTab("learn");
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "learn") {
      setSearchParams({ tab: "learn" });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-center mb-12">
              <TabsTrigger 
                value="text-to-braille"
                className="text-base min-w-fit"
              >
                Text-to-Braille
              </TabsTrigger>
              <TabsTrigger 
                value="braille-to-text"
                className="text-base min-w-fit"
              >
                Braille-to-Text
              </TabsTrigger>
              <TabsTrigger 
                value="camera-braille"
                className="text-base min-w-fit"
              >
                Image-to-Braille/Text
              </TabsTrigger>
              <TabsTrigger 
                value="document-parser"
                className="text-base min-w-fit"
              >
                Document Parser
              </TabsTrigger>
              <TabsTrigger 
                value="learn"
                className="text-base min-w-fit"
              >
                Learn Braille
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text-to-braille">
              <TextToBrailleTab />
            </TabsContent>

            <TabsContent value="braille-to-text">
              <BrailleToTextTab />
            </TabsContent>

            <TabsContent value="camera-braille">
              <CameraBrailleTab />
            </TabsContent>

            <TabsContent value="document-parser">
              <DocumentParserTab />
            </TabsContent>

            <TabsContent value="learn">
              <LearnBrailleHub />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Index;