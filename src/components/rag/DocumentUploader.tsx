
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRAG, Document } from "@/hooks/useRAG";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Upload, X } from "lucide-react";

export function DocumentUploader() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const { initialize, isInitialized, isLoading } = useRAG();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    
    try {
      const newDocs: Document[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const text = await file.text();
        
        newDocs.push({
          text,
          metadata: {
            filename: file.name,
            type: file.type,
            size: file.size,
          },
        });
      }
      
      setDocuments(prev => [...prev, ...newDocs]);
    } catch (error) {
      console.error("Error reading document:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleInitialize = async () => {
    if (documents.length === 0) return;
    await initialize(documents);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>
          Upload documents to enhance script generation with relevant context
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {documents.map((doc, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate max-w-[200px]">
                {doc.metadata?.filename || `Document ${index + 1}`}
              </span>
              <button 
                onClick={() => removeDocument(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        {documents.length === 0 && !isInitialized && (
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <p className="text-muted-foreground mb-2">No documents uploaded</p>
            <p className="text-xs text-muted-foreground">
              Upload text documents to provide context for AI script generation
            </p>
          </div>
        )}
        
        {isInitialized && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 text-center">
            <p className="text-green-600 dark:text-green-400">
              Knowledge base initialized with {documents.length} documents
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            type="file"
            id="document-upload"
            accept=".txt,.md,.docx,.pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading || isLoading}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("document-upload")?.click()}
            disabled={uploading || isLoading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </>
            )}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleInitialize} 
          disabled={documents.length === 0 || isLoading || isInitialized}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Initializing...
            </>
          ) : isInitialized ? (
            "Knowledge Base Ready"
          ) : (
            "Initialize Knowledge Base"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
