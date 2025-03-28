
import { useState } from "react";
import { initializeRAG, queryRAG } from "@/utils/rag";
import { generateScript, ScriptGenerationParams } from "@/utils/api/openai";

export const useRAG = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the RAG system with documents
  const initialize = async (documents: Array<{text: string, metadata?: Record<string, any>}>) => {
    setIsLoading(true);
    try {
      const success = await initializeRAG(documents);
      setIsInitialized(success);
      return success;
    } catch (error) {
      console.error("Failed to initialize RAG:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate a script with RAG enhancement
  const generateEnhancedScript = async (params: ScriptGenerationParams) => {
    setIsLoading(true);
    try {
      // If RAG is not initialized, fall back to regular generation
      if (!isInitialized) {
        return await generateScript(params);
      }
      
      // Get relevant context from RAG
      const relevantDocs = await queryRAG(params.topic, 3);
      
      // Extract the content from the documents to use as context
      const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");
      
      // Generate script with the additional context
      const enhancedParams = {
        ...params,
        additionalContext: context
      };
      
      return await generateScript(enhancedParams);
    } catch (error) {
      console.error("Error generating enhanced script:", error);
      // Fall back to regular generation
      return await generateScript(params);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    initialize,
    generateEnhancedScript,
    isInitialized,
    isLoading
  };
};
