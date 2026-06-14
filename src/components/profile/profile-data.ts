import { User, Crown, BadgeDollarSign } from "lucide-react";
import type { TFunction } from "i18next";

export interface ProfileMenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
}

export const getProfileMenuItems = (isPremium: boolean, t: TFunction): ProfileMenuItem[] => {
  const menuItems: ProfileMenuItem[] = [
    {
      label: t("nav.profile"),
      icon: User,
      href: "/profile",
    },
  ];

  if (!isPremium) {
    menuItems.push({
      label: t("nav.subscribePremium"),
      icon: Crown,
      href: "/premium#planos",
    });
  } else {
    menuItems.push({
      label: t("nav.manageSubscription"),
      icon: BadgeDollarSign,
      href: "/premium#planos",
    });
  }

  return menuItems;
};
