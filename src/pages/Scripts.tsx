import { useState } from "react";
import { FileText, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const Scripts = () => {
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  
  // Mock scripts data (in a real app, this would come from an API)
  const scripts = [
    {
      id: "1",
      title: "AI in Daily Life",
      excerpt: "Exploring how artificial intelligence is transforming our everyday activities...",
      status: "Draft",
      lastModified: "2024-02-20",
    },
    {
      id: "2",
      title: "Future of Work",
      excerpt: "Analyzing the evolving landscape of remote work and digital transformation...",
      status: "Complete",
      lastModified: "2024-02-19",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Scripts</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your video scripts
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Script
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scripts List */}
        <div className="lg:col-span-1 space-y-4">
          {scripts.map((script) => (
            <Card 
              key={script.id}
              className={`cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground
                ${selectedScript === script.id ? 'border-accent' : ''}`}
              onClick={() => setSelectedScript(script.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{script.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last modified: {script.lastModified}
                    </p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full 
                    ${script.status === 'Complete' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {script.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {script.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Script Editor */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Script Editor</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Generate
                  </Button>
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[500px] resize-none"
                placeholder="Start writing your script here..."
                value={selectedScript ? scripts.find(s => s.id === selectedScript)?.excerpt : ""}
                onChange={(e) => {/* Handle script changes */}}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scripts;