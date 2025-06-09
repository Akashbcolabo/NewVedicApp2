

// Placeholder for Supabase client initialization
// In a real app, you would initialize Supabase client here
// import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url-placeholder';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key-placeholder';

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock Supabase client for local development if not fully set up
interface MockSupabaseQueryBuilder {
  select: (columns?: string) => MockSupabaseQueryBuilder;
  eq: (column: string, value: any) => MockSupabaseQueryBuilder;
  single: () => Promise<{ data: any | null; error: any | null }>;
  // Add other methods you use like insert, update, delete, order, limit etc.
}

interface MockSupabaseClient {
  from: (table: string) => MockSupabaseQueryBuilder;
}

export const supabase: MockSupabaseClient = {
  from: (table: string) => ({
    select: function(columns: string = '*') {
      console.log(`Mock Supabase: Selecting "${columns}" from "${table}"`);
      return this;
    },
    eq: function(column: string, value: any) {
      console.log(`Mock Supabase: Filtering where "${column}" equals "${value}"`);
      return this;
    },
    single: async function() {
      console.log('Mock Supabase: Attempting to fetch a single record.');
      // Simulate a short delay and a possible error or no data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // To test hero content loading, you can simulate returning data:
      if (table === 'hero_content') {
        // Simulate finding content occasionally
        if (Math.random() > 0.5) {
          console.log('Mock Supabase: Found hero_content.');
          return { 
            data: { 
              type: Math.random() > 0.5 ? 'image' : 'video', 
              url: Math.random() > 0.5 ? 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop' : 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
              active: true 
            }, 
            error: null 
          };
        } else {
           console.log('Mock Supabase: hero_content not found (PGRST116).');
           return { data: null, error: { message: "No rows found", code: "PGRST116" } };
        }
      }
      
      console.log('Mock Supabase: No data found for this query or table.');
      return { data: null, error: { message: "Mock error: Row not found or connection issue", code: "PGRST116" } };
    }
    // Add other mock methods as needed
  })
};

console.log("Using MOCK Supabase client. Define REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY and uncomment actual client for real Supabase.");

// Ensure environment variables are accessible if you switch to the real client.
// Typically, for React apps created with Create React App, env vars need to be prefixed with REACT_APP_.
// Example: process.env.REACT_APP_SUPABASE_URL