
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { DocumentUploader } from "@/components/rag/DocumentUploader";

const Scripts = () => {
  // Sample scripts data
  const scripts = [
    {
      id: "script-1",
      title: "How AI is Changing Content Creation",
      preview: "In this video, we'll explore how artificial intelligence is revolutionizing content creation...",
      createdAt: "2024-02-15",
      wordCount: 850,
    },
    {
      id: "script-2",
      title: "10 Tips for Better YouTube Videos",
      preview: "Want to improve your YouTube videos? In this guide, we'll cover 10 essential tips...",
      createdAt: "2024-02-10",
      wordCount: 1250,
    },
    {
      id: "script-3",
      title: "The Future of Remote Work",
      preview: "Remote work is here to stay. In this video, we'll discuss the future trends and how...",
      createdAt: "2024-02-05",
      wordCount: 925,
    },
  ];

  const [activeScript, setActiveScript] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Scripts</h1>
        <p className="text-muted-foreground mt-2">
          Create, manage and generate your video scripts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Scripts list */}
        <div className="space-y-4">
          <Button className="w-full gap-2">
            <Sparkles className="w-4 h-4" />
            Create New Script
          </Button>

          <div className="space-y-2">
            {scripts.map((script) => (
              <Card 
                key={script.id} 
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${activeScript === script.id ? 'border-primary' : ''}`}
                onClick={() => setActiveScript(script.id)}
              >
                <CardContent className="p-4">
                  <h3 className="font-medium text-md">{script.title}</h3>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{script.createdAt}</span>
                    <span>{script.wordCount} words</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right section - Script editor and knowledge base */}
        <div className="lg:col-span-2 space-y-6">
          {/* Script editor/viewer */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>Script Editor</CardTitle>
              <CardDescription>
                Write or generate your script content
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {activeScript ? (
                <div className="h-full border rounded-md p-4">
                  {scripts.find(s => s.id === activeScript)?.preview}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a script or create a new one
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Knowledge base section */}
          <Tabs defaultValue="documents">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">Knowledge Base</TabsTrigger>
              <TabsTrigger value="settings">Script Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="documents">
              <DocumentUploader />
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Script Settings</CardTitle>
                  <CardDescription>
                    Customize your script generation preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Script settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Scripts;
