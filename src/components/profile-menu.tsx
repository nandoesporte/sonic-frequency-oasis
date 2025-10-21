
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { getProfileMenuItems } from "./profile/profile-data";
import { usePremium } from "@/contexts/PremiumContext";
import { useProfileMenu } from "@/hooks";
import { LogOut } from "lucide-react";

interface ProfileMenuProps {
  user: User;
  onSignOut: (e: React.MouseEvent) => void;
}

export function ProfileMenu({ user, onSignOut }: ProfileMenuProps) {
  const { isOpen, toggleMenu, closeMenu, menuRef } = useProfileMenu();
  const { isPremium } = usePremium();
  
  // Get menu items
  const menuItems = getProfileMenuItems(isPremium);
  
  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    const fullName = user.user_metadata?.full_name || user.email || '';
    if (fullName) {
      return fullName
        .split(' ')
        .map(name => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : '?';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1 px-3 border-b border-border">
            <p className="text-sm font-medium truncate">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href || '#'}
                onClick={item.action || closeMenu}
                className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={onSignOut}
              className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
