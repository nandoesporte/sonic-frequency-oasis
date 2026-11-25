
import React from "react";
import { MapPin, Mail, MessageSquare } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  
  return (
    <footer className="bg-background border-t border-border/40 mt-auto relative">
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/5544997270698" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-24 right-4 sm:right-6 z-50 w-12 h-12 flex items-center justify-center bg-secondary border border-input text-foreground hover:bg-card rounded-full shadow-lg transition-colors duration-100"
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
              {t("footer.description")}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              CNPJ: 14.164.334/0001-05
            </p>
          </div>
          
          {/* Company Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t("footer.info")}</h4>
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
            <h4 className="text-lg font-semibold text-foreground">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/scientific" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.scientific")}
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.guide")}
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.premiumSubscription")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {t("footer.rights")}
          </p>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t("footer.terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
