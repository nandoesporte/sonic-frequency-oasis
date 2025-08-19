
/// <reference types="vite/client" />

// Wake Lock API types
interface WakeLockSentinel {
  release(): Promise<void>;
}

interface Navigator {
  wakeLock?: {
    request(type: 'screen'): Promise<WakeLockSentinel>;
  };
}

// Import the Database type from supabase
import { Database } from "@/integrations/supabase/types";
