
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider, useAudio } from "@/lib/audio-context";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

const HistoryContent = () => {
  const { history } = useAudio();
  
  return (
    <div className="container pt-32 pb-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Recently Played</h1>
      <p className="text-muted-foreground mb-8">Your listening history</p>
      
      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((frequency) => (
            <FrequencyCard key={frequency.id} frequency={frequency} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-xl">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No history yet</h2>
          <p className="text-muted-foreground mb-6">
            Start playing frequencies to build your listening history
          </p>
          <Button asChild>
            <Link to="/">
              Explore Frequencies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

const History = () => {
  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        <HistoryContent />
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default History;
