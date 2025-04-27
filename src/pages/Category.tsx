
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider } from "@/lib/audio-context";
import { getCategoryById, getFrequenciesByCategory, FrequencyData } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = id || '';
  const category = getCategoryById(categoryId);
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFrequencies = async () => {
      if (categoryId) {
        try {
          setLoading(true);
          console.log("Fetching frequencies for category:", categoryId);
          const data = await getFrequenciesByCategory(categoryId);
          setFrequencies(data);
          console.log("Fetched frequencies:", data.length);
        } catch (error) {
          console.error("Error fetching frequencies:", error);
          toast({
            title: "Erro ao carregar frequências",
            description: "Não foi possível carregar as frequências desta categoria.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchFrequencies();
  }, [categoryId]);
  
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
