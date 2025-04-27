
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/audio-context";
import { supabase } from "@/integrations/supabase/client";

const TrendingContent = () => {
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrendingFrequencies = async () => {
      const { data, error } = await supabase
        .from('frequencies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching trending frequencies:', error);
        return;
      }
      
      setFrequencies(data.map(freq => ({
        id: freq.id,
        name: freq.name,
        hz: freq.hz,
        purpose: freq.purpose,
        description: freq.description,
        category: freq.category,
        premium: freq.is_premium,
        trending: true
      })));
      setLoading(false);
    };

    fetchTrendingFrequencies();
  }, []);

  return (
    <div className="container pt-32 pb-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Frequências em Alta</h1>
      <p className="text-muted-foreground mb-8">As frequências mais populares do momento</p>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando frequências...</p>
        </div>
      ) : frequencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {frequencies.map((frequency) => (
            <FrequencyCard key={frequency.id} frequency={frequency} />
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
