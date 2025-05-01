
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Heart, Crown, History, Menu, Home, LogOut, User, Book, Brain } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/hooks/use-premium";

export function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { isPremium } = usePremium();
  
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    { name: "Início", path: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Base Científica", path: "/scientific", icon: <Brain className="w-4 h-4 mr-2" /> },
    { name: "Favoritos", path: "/favorites", icon: <Heart className="w-4 h-4 mr-2" /> },
    { name: "Histórico", path: "/history", icon: <History className="w-4 h-4 mr-2" /> },
    { name: "Guia de Uso", path: "/guide", icon: <Book className="w-4 h-4 mr-2" /> }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
    }`}>
      <div className="container px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center text-xl font-bold mr-6">
            <div className="hidden sm:flex items-center">
              <span className="text-primary">Frequency</span>
              <span className="ml-1">App</span>
            </div>
            <div className="sm:hidden flex items-center">
              <span className="text-primary">F</span>
              <span>A</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? "secondary" : "ghost"}
                asChild
                className="h-9"
              >
                <Link to={link.path} className="flex items-center">
                  {link.icon}
                  {link.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => signOut()} className="hidden sm:flex">
                <LogOut className="h-5 w-5" />
              </Button>
              
              <Button variant={isPremium ? "ghost" : "default"} size="sm" asChild className="hidden sm:flex">
                <Link to="/premium">
                  <Crown className="mr-2 h-4 w-4" />
                  {isPremium ? "Premium Ativo" : "Obter Premium"}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" size="sm" asChild className="hidden sm:flex">
                <Link to="/auth">
                  <User className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              
              <Button variant="default" size="sm" asChild className="hidden sm:flex">
                <Link to="/premium">
                  <Crown className="mr-2 h-4 w-4" />
                  Obter Premium
                </Link>
              </Button>
            </>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant={isActive(link.path) ? "secondary" : "ghost"}
                    asChild
                    className="justify-start"
                  >
                    <Link to={link.path} className="flex items-center">
                      {link.icon}
                      {link.name}
                    </Link>
                  </Button>
                ))}
                
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => signOut()} className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                    
                    <Button variant={isPremium ? "ghost" : "default"} className="justify-start" asChild>
                      <Link to="/premium">
                        <Crown className="mr-2 h-4 w-4" />
                        {isPremium ? "Premium Ativo" : "Obter Premium"}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="default" asChild className="justify-start">
                      <Link to="/auth">
                        <User className="mr-2 h-4 w-4" />
                        Entrar
                      </Link>
                    </Button>
                    
                    <Button variant="default" className="mt-4" asChild>
                      <Link to="/premium">
                        <Crown className="mr-2 h-4 w-4" />
                        Obter Premium
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
