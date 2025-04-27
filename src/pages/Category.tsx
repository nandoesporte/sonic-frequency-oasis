
import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider } from "@/lib/audio-context";
import { getCategoryById, getFrequenciesByCategory, FrequencyData } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const category = id ? getCategoryById(id) : undefined;
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only redirect after we've confirmed auth is not loading
  if (!user && !authLoading) {
    console.log("User not authenticated, redirecting to login");
    toast.error("Você precisa fazer login para acessar as frequências");
    return <Navigate to="/auth" replace />;
  }
  
  useEffect(() => {
    const fetchFrequencies = async () => {
      if (id && user) {
        setLoading(true);
        setError(null);
        try {
          console.log("Fetching frequencies for category:", id);
          const data = await getFrequenciesByCategory(id);
          console.log("Frequencies fetched:", data);
          setFrequencies(data);
        } catch (err) {
          console.error("Error fetching frequencies:", err);
          setError("Não foi possível carregar as frequências. Tente novamente mais tarde.");
          toast.error("Erro ao carregar frequências");
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (user) {
      fetchFrequencies();
    }
  }, [id, user]);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Categoria não encontrada</h2>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const CategoryIcon = category.icon;

  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        
        <div className="container pt-32 pb-12 px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Categorias
            </Link>
          </Button>
          
          <div className="flex items-center mb-8">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <CategoryIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando frequências...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-destructive/10 rounded-xl">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : frequencies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {frequencies.map((frequency) => (
                <FrequencyCard key={frequency.id} frequency={frequency} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma frequência encontrada nesta categoria.</p>
            </div>
          )}
        </div>
        
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Category;
