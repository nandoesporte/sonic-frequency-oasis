
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
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
  const { category } = useParams<{ category: string }>();
  const [categoryData, setCategoryData] = useState(category ? getCategoryById(category) : undefined);
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Update category data when param changes
    if (category) {
      const data = getCategoryById(category);
      setCategoryData(data);
      
      if (!data) {
        console.error(`Category not found: ${category}`);
        toast.error('Categoria não encontrada', {
          description: `A categoria "${category}" não foi encontrada.`
        });
        navigate('/', { replace: true });
      }
    }
  }, [category, navigate]);
  
  useEffect(() => {
    // Redirect to auth if not logged in and auth check is complete
    if (!authLoading && !user) {
      console.log("User not authenticated, redirecting to login");
      toast.error("Acesso negado", {
        description: "Você precisa fazer login para acessar as frequências"
      });
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    const fetchFrequencies = async () => {
      if (category && user && categoryData) {
        setLoading(true);
        setError(null);
        try {
          console.log("Fetching frequencies for category:", category);
          const data = await getFrequenciesByCategory(category);
          console.log("Frequencies fetched:", data);
          setFrequencies(data);
          
          if (data.length === 0) {
            toast.info('Sem frequências', {
              description: 'Nenhuma frequência encontrada nesta categoria.'
            });
          } else {
            toast.success('Frequências carregadas', {
              description: `${data.length} frequências encontradas`
            });
          }
        } catch (err) {
          console.error("Error fetching frequencies:", err);
          setError("Não foi possível carregar as frequências. Tente novamente mais tarde.");
          toast.error("Erro ao carregar frequências", {
            description: "Ocorreu um erro ao buscar as frequências. Tente novamente mais tarde."
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (user && categoryData) {
      fetchFrequencies();
    } else if (user && !categoryData && category) {
      setLoading(false);
      setError("Categoria não encontrada");
    }
  }, [category, user, categoryData]);
  
  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-muted-foreground">Verificando autenticação...</p>
      </div>
    );
  }

  // Don't render main content while redirecting
  if (!user && !authLoading) {
    return null; // useEffect will handle redirection
  }
  
  if (!categoryData && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Categoria não encontrada</h2>
          <p className="text-muted-foreground mb-6">A categoria que você está procurando não existe.</p>
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

  const CategoryIcon = categoryData?.icon;

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
          
          {categoryData && (
            <div className="flex items-center mb-8">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                {CategoryIcon && <CategoryIcon className="h-8 w-8 text-primary" />}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{categoryData.name}</h1>
                <p className="text-muted-foreground">{categoryData.description}</p>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Carregando frequências...</p>
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
