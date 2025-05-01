
import { User, LogOut, Crown, BadgeCheck, BadgeDollarSign } from "lucide-react";

export interface ProfileMenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
}

export const getProfileMenuItems = (isPremium: boolean): ProfileMenuItem[] => {
  const menuItems: ProfileMenuItem[] = [
    {
      label: "Meu Perfil",
      icon: User,
      href: "/profile"
    }
  ];
  
  if (!isPremium) {
    menuItems.push({
      label: "Assinar Premium",
      icon: Crown,
      href: "/premium#planos"
    });
  } else {
    menuItems.push({
      label: "Gerenciar Assinatura",
      icon: BadgeDollarSign,
      href: "/premium#planos"
    });
  }
  
  return menuItems;
};
