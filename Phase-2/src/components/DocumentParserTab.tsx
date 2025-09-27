import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUpload } from "./document-parser/DocumentUpload";
import { DocumentSections } from "./document-parser/DocumentSections";
import { SectionTranslator } from "./document-parser/SectionTranslator";
import { ManualTextTranslator } from "./document-parser/ManualTextTranslator";

export interface ParsedSection {
  id: string;
  type: 'header' | 'paragraph' | 'table';
  title: string;
  content: string;
  level?: number; // For headers (h1, h2, etc.)
}

export interface ParsedDocument {
  fileName: string;
  sections: ParsedSection[];
}

export const DocumentParserTab = () => {
  const [parsedDocument, setParsedDocument] = useState<ParsedDocument | null>(null);
  const [selectedSection, setSelectedSection] = useState<ParsedSection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const handleDocumentParsed = (document: ParsedDocument) => {
    setParsedDocument(document);
    setSelectedSection(null);
    // Extract all text content for manual selection
    const fullText = document.sections.map(section => section.content).join('\n\n');
    setExtractedText(fullText);
  };

  const handleSectionSelect = (section: ParsedSection) => {
    setSelectedSection(section);
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
  };

  const handleNewDocument = () => {
    setParsedDocument(null);
    setSelectedSection(null);
    setExtractedText("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Smart Text Document Parser
        </h2>
        <p className="text-lg text-muted-foreground">
          Upload your documents and extract specific sections to translate into Braille patterns
        </p>
      </div>

      {/* Document Upload - Show initially */}
      {!parsedDocument ? (
        <DocumentUpload 
          onDocumentParsed={handleDocumentParsed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        /* Tabbed Interface - Show after document is parsed */
        <Tabs defaultValue="auto-select" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="auto-select" className="text-base">
              Auto-Select
            </TabsTrigger>
            <TabsTrigger value="manual-select" className="text-base">
              Manual Select
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto-select">
            {!selectedSection ? (
              <DocumentSections 
                document={parsedDocument}
                onSectionSelect={handleSectionSelect}
                onNewDocument={handleNewDocument}
              />
            ) : (
              <SectionTranslator 
                section={selectedSection}
                fileName={parsedDocument.fileName}
                onBack={handleBackToSections}
                onNewDocument={handleNewDocument}
              />
            )}
          </TabsContent>

          <TabsContent value="manual-select">
            <ManualTextTranslator 
              extractedText={extractedText}
              fileName={parsedDocument.fileName}
              onNewDocument={handleNewDocument}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};