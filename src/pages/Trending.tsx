
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

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
        
        setFrequencies(data.map(freq => ({
          id: freq.id,
          name: freq.name,
          hz: freq.hz,
          purpose: freq.purpose,
          description: freq.description || freq.purpose, // Ensure description is never undefined
          category: freq.category,
          premium: freq.is_premium,
          trending: true
        })));
        
        toast.success('Frequências carregadas', {
          description: `${data.length} frequências em alta encontradas`
        });
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('Erro ao carregar frequências', {
          description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      console.log("User authenticated, fetching frequencies");
      fetchTrendingFrequencies();
    } else {
      console.log("No user, skipping fetch");
      setLoading(false);
    }
  }, [user]);

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to auth page");
      toast.error('Acesso negado', {
        description: 'É necessário estar logado para acessar esta página.'
      });
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="ml-4 text-muted-foreground">Verificando autenticação...</p>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!user && !loading) {
    return null; // Return null as useEffect will handle redirection
  }
  
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
