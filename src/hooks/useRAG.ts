
import { useState, useCallback } from "react";
import { initializeRAG, queryRAG } from "@/utils/rag";
import { useToast } from "@/hooks/use-toast";

export type Document = {
  text: string;
  metadata?: Record<string, any>;
};

export const useRAG = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Initialize the RAG system with documents
  const initialize = useCallback(async (documents: Document[]) => {
    if (!documents.length) {
      toast({
        title: "No documents provided",
        description: "Please provide at least one document to initialize the RAG system",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      const success = await initializeRAG(documents);
      setIsInitialized(success);
      
      if (success) {
        toast({
          title: "RAG System Initialized",
          description: `Successfully loaded ${documents.length} documents into the knowledge base.`,
        });
      } else {
        // Don't show error toast for missing API key, just silently fall back
        console.log("RAG initialization skipped - using fallback methods");
      }
      
      return success;
    } catch (error) {
      console.error("Failed to initialize RAG:", error);
      // No need to show error toast for expected failures
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Generate a script with RAG enhancement
  const generateEnhancedScript = useCallback(async (params) => {
    setIsLoading(true);
    try {
      // If RAG is not initialized, fall back to regular generation
      if (!isInitialized) {
        console.log("RAG not initialized, falling back to regular script generation");
        return await generateScript(params);
      }
      
      console.log("Querying RAG system for context on:", params.topic);
      
      // Get relevant context from RAG
      const relevantDocs = await queryRAG(params.topic, 3);
      
      if (!relevantDocs || relevantDocs.length === 0) {
        console.log("No relevant documents found, falling back to regular script generation");
        return await generateScript(params);
      }
      
      console.log(`Found ${relevantDocs.length} relevant documents for enhancement`);
      
      // Extract the content from the documents to use as context
      const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");
      
      // Generate script with the additional context
      const enhancedParams = {
        ...params,
        additionalContext: context
      };
      
      console.log("Generating enhanced script with additional context");
      return await generateScript(enhancedParams);
    } catch (error) {
      console.error("Error generating enhanced script:", error);
      
      // Fall back to regular generation
      return await generateScript(params);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);
  
  return {
    initialize,
    generateEnhancedScript,
    isInitialized,
    isLoading
  };
};

// Import at the end to avoid circular dependency
import { generateScript } from "@/utils/api/openai";
