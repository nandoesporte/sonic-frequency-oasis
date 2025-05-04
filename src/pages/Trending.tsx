
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const TrendingContent = () => {
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTrendingFrequencies = async () => {
      try {
        console.log("Fetching trending frequencies...");
        setLoading(true);
        const { data, error } = await supabase
          .from('frequencies')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching trending frequencies:', error);
          toast.error('Erro ao carregar frequências', {
            description: 'Não foi possível carregar as frequências em alta.'
          });
          return;
        }
        
        console.log("Frequencies data received:", data);
        
        if (!data || data.length === 0) {
          console.log("No frequencies found");
          toast.info('Sem frequências', {
            description: 'Não foram encontradas frequências em alta.'
          });
          setFrequencies([]);
          return;
        }
        
        // Process the data to mark the first one as free
        const processedData = markFirstFrequency(data);
        
        setFrequencies(processedData.map(freq => ({
          id: freq.id,
          name: freq.name,
          hz: freq.hz,
          purpose: freq.purpose,
          description: freq.description || freq.purpose, // Ensure description is never undefined
          category: freq.category,
          premium: freq.is_premium,
          free: freq.is_free_sample,
          trending: true
        })));
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('Erro ao carregar frequências', {
          description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingFrequencies();
  }, []);

  // Helper function to mark first frequency as free
  function markFirstFrequency(frequencies: any[]) {
    if (!frequencies || frequencies.length === 0) {
      return [];
    }
    
    // Make a copy to avoid mutating the original
    const result = [...frequencies];
    
    // Find the first non-premium frequency, or just the first one if all are premium
    const freeIndex = result.findIndex(freq => !freq.is_premium);
    const indexToMark = freeIndex >= 0 ? freeIndex : 0;
    
    if (result[indexToMark]) {
      result[indexToMark] = {
        ...result[indexToMark],
        is_free_sample: true
      };
    }
    
    return result;
  }

  // We don't need to handle login redirects here anymore as FrequencyCard handles that
  const handleFrequencyClick = () => {
    return false; // Always allow FrequencyCard to handle the logic
  };

  return (
    <div className="container pt-32 pb-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Frequências em Alta</h1>
      <p className="text-muted-foreground mb-8">As frequências mais populares do momento</p>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Carregando frequências...</p>
        </div>
      ) : frequencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {frequencies.map((frequency) => (
            <FrequencyCard 
              key={frequency.id} 
              frequency={frequency}
              onBeforePlay={handleFrequencyClick} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma frequência em alta encontrada.</p>
        </div>
      )}
    </div>
  );
};

const Trending = () => {
  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        <TrendingContent />
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Trending;
