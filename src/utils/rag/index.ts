
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Simple in-memory document store
let vectorStore: MemoryVectorStore | null = null;

// Initialize the vector store with documents
export async function initializeRAG(documents: Array<{text: string, metadata?: Record<string, any>}>) {
  try {
    const docs = documents.map(
      doc => new Document({ pageContent: doc.text, metadata: doc.metadata || {} })
    );
    
    // Use OpenAI embeddings (requires API key)
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
    
    // Create a simple in-memory vector store
    vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    
    return true;
  } catch (error) {
    console.error("Failed to initialize RAG:", error);
    return false;
  }
}

// Perform similarity search to find relevant documents
export async function queryRAG(query: string, k: number = 3) {
  if (!vectorStore) {
    throw new Error("RAG system not initialized. Call initializeRAG first.");
  }
  
  try {
    const results = await vectorStore.similaritySearch(query, k);
    return results;
  } catch (error) {
    console.error("Error querying RAG:", error);
    throw error;
  }
}
