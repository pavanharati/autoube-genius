// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://syioitnmmjztbokumisu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aW9pdG5tbWp6dGJva3VtaXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMTY2MjgsImV4cCI6MjA1MDY5MjYyOH0.K_8NVhdXEKFARm6IQkQxG6VOTuemjdaslLB2px_mC_Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);