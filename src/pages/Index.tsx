
import { AudioPlayer } from "@/components/audio-player";
import { CategoryCard } from "@/components/category-card";
import { FrequencyCard } from "@/components/frequency-card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { categories, getCategoryCount, getTrendingFrequencies } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const trendingFrequencies = getTrendingFrequencies();

  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-purple-dark dark:text-purple-light">Experience</span> Therapeutic Sound
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore healing frequencies for relaxation, focus, and well-being
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/category/healing">
                Start Healing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Trending Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
              <Button variant="ghost" asChild>
                <Link to="/trending">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingFrequencies.map((frequency) => (
                <FrequencyCard
                  key={frequency.id}
                  frequency={frequency}
                  variant="trending"
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Categories</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description={category.description}
                    icon={<CategoryIcon className="h-6 w-6" />}
                    count={getCategoryCount(category.id)}
                  />
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Premium Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-purple-light/20 to-blue-light/20 dark:from-purple/30 dark:to-blue-light/10 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Unlock Premium Frequencies</h2>
                  <p className="text-muted-foreground mb-6">
                    Access our full library of specialized healing frequencies, 
                    personalized recommendations, and advanced features.
                  </p>
                  <Button size="lg">
                    <Crown className="mr-2 h-4 w-4" />
                    Get Premium
                  </Button>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-primary/20 animate-pulse-soft"></div>
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-primary/30 animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-[37.5%] left-[37.5%] w-1/4 h-1/4 rounded-full bg-primary/50 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Index;
