import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Hash, Table, AlignLeft, Upload, ChevronRight } from "lucide-react";
import { ParsedDocument, ParsedSection } from "../DocumentParserTab";

interface DocumentSectionsProps {
  document: ParsedDocument;
  onSectionSelect: (section: ParsedSection) => void;
  onNewDocument: () => void;
}

const getSectionIcon = (type: ParsedSection['type']) => {
  switch (type) {
    case 'header':
      return Hash;
    case 'paragraph':
      return AlignLeft;
    case 'table':
      return Table;
    default:
      return FileText;
  }
};

const getSectionColor = (type: ParsedSection['type']) => {
  switch (type) {
    case 'header':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'paragraph':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'table':
      return 'bg-secondary text-secondary-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const DocumentSections = ({ document, onSectionSelect, onNewDocument }: DocumentSectionsProps) => {
  const headerSections = document.sections.filter(s => s.type === 'header');
  const paragraphSections = document.sections.filter(s => s.type === 'paragraph');
  const tableSections = document.sections.filter(s => s.type === 'table');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="p-6 bg-gradient-card shadow-soft border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {document.fileName}
              </h3>
              <p className="text-muted-foreground">
                {document.sections.length} sections extracted
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onNewDocument}>
            <Upload className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-card shadow-soft border-0">
          <div className="flex items-center gap-3">
            <Hash className="w-6 h-6 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{headerSections.length}</p>
              <p className="text-sm text-muted-foreground">Headers</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card shadow-soft border-0">
          <div className="flex items-center gap-3">
            <AlignLeft className="w-6 h-6 text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">{paragraphSections.length}</p>
              <p className="text-sm text-muted-foreground">Paragraphs</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card shadow-soft border-0">
          <div className="flex items-center gap-3">
            <Table className="w-6 h-6 text-secondary-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{tableSections.length}</p>
              <p className="text-sm text-muted-foreground">Tables</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sections List */}
      <Card className="p-6 bg-gradient-card shadow-soft border-0">
        <h4 className="text-lg font-semibold text-foreground mb-6">
          Select a Section to Translate
        </h4>
        
        <div className="space-y-3">
          {document.sections.map((section) => {
            const Icon = getSectionIcon(section.type);
            
            return (
              <div
                key={section.id}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:shadow-soft"
                onClick={() => onSectionSelect(section)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium text-foreground truncate">
                          {section.title}
                        </h5>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getSectionColor(section.type)}`}
                        >
                          {section.type}
                          {section.level && ` H${section.level}`}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {section.content.length > 120 
                          ? section.content.substring(0, 120) + '...'
                          : section.content
                        }
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-1">
                        {section.content.length} characters
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
        
        {document.sections.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg text-muted-foreground">No sections found in this document.</p>
          </div>
        )}
      </Card>
    </div>
  );
};