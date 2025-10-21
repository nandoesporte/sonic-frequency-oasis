
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Heart, Crown, History, Menu, Home, LogOut, User, Book, Brain, Smartphone } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { Logo } from "@/components/ui/logo";
import { ProfileMenu } from "@/components/profile-menu";
import { PWAInstallButton } from "@/components/ui/pwa-install-button";

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

  // Determine if we're on the premium page to avoid adding the hash when already there
  const isPremiumPage = location.pathname === "/premium";
  const premiumPath = isPremiumPage ? "/premium#planos" : "/premium";
  
  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    signOut();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
    }`}>
      <div className="container px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Replace the old text logo with our new Logo component */}
          <Logo 
            variant={window.innerWidth < 640 ? "mobile" : "default"} 
            className="mr-6"
          />
          
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
          {/* PWA Install Button - only show for logged users */}
          {user && <PWAInstallButton className="hidden sm:flex" />}
          <ThemeToggle />
          
          {user ? (
            <>
              {/* Replace the old user buttons with Profile Menu component */}
              <ProfileMenu user={user} onSignOut={handleSignOut} />
              
              <Button variant={isPremium ? "ghost" : "default"} size="sm" asChild className="hidden sm:flex">
                <Link to={premiumPath}>
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
                <Link to={premiumPath}>
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
                {user && (
                  <div className="flex items-center mb-4 p-2 bg-background/50 rounded-lg">
                    <div className="ml-2">
                      <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}
                
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
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut} 
                      className="justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                    
                    <Button variant={isPremium ? "ghost" : "default"} className="justify-start" asChild>
                      <Link to={premiumPath}>
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
                      <Link to={premiumPath}>
                        <Crown className="mr-2 h-4 w-4" />
                        Obter Premium
                      </Link>
                    </Button>
                  </>
                )}
                
                {/* PWA Install in mobile menu for logged users */}
                {user && (
                  <div className="mt-4 border-t pt-4">
                    <PWAInstallButton variant="card" showInstructions />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
