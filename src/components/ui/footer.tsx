
import React from "react";
import { MapPin, Mail, MessageSquare } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border/40 mt-auto relative">
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/5544997270698" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg transition-transform hover:scale-110"
        aria-label="Contato WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
      
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Logo and Description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Soluções tecnológicas que transformam frequências em bem-estar e qualidade de vida.
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              CNPJ: 14.164.334/0001-05
            </p>
          </div>
          
          {/* Company Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Informações</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Avenida Doutor Luiz Teixeira Mendes, 3096 - Zona 05, Maringa - PR, 87.015-001
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:contato@kefersolucoes.com.br" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  contato@kefersolucoes.com.br
                </a>
              </li>
              <li className="flex items-center mt-2">
                <MessageSquare className="h-5 w-5 text-primary mr-2" />
                <a 
                  href="https://wa.me/5544997270698" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  WhatsApp: (44) 99727-0698
                </a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/scientific" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Base Científica
                </a>
              </li>
              <li>
                <a href="/guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Guia de Uso
                </a>
              </li>
              <li>
                <a href="/premium" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Assinatura Premium
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Copyright Section */}
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
