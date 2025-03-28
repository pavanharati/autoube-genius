
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Simple in-memory document store
let vectorStore: MemoryVectorStore | null = null;

// Initialize the vector store with documents
export async function initializeRAG(documents: Array<{text: string, metadata?: Record<string, any>}>) {
  if (!documents || documents.length === 0) {
    console.error("No documents provided for RAG initialization");
    throw new Error("No documents provided for RAG initialization");
  }

  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.error("OpenAI API key is missing");
    throw new Error("OpenAI API key is missing. Please add it in your environment variables.");
  }
  
  try {
    console.log(`Initializing RAG with ${documents.length} documents`);
    
    const docs = documents.map(
      doc => new Document({ 
        pageContent: doc.text, 
        metadata: doc.metadata || {} 
      })
    );
    
    // Use OpenAI embeddings (requires API key)
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
    
    // Create a simple in-memory vector store
    vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    console.log("RAG system successfully initialized");
    
    return true;
  } catch (error) {
    console.error("Failed to initialize RAG:", error);
    vectorStore = null;
    throw error;
  }
}

// Perform similarity search to find relevant documents
export async function queryRAG(query: string, k: number = 3) {
  if (!vectorStore) {
    throw new Error("RAG system not initialized. Call initializeRAG first.");
  }
  
  if (!query || query.trim().length === 0) {
    throw new Error("Query cannot be empty");
  }
  
  try {
    console.log(`Querying RAG system with: "${query}"`);
    const results = await vectorStore.similaritySearch(query, k);
    console.log(`Found ${results.length} relevant documents`);
    return results;
  } catch (error) {
    console.error("Error querying RAG:", error);
    throw error;
  }
}
