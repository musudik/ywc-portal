import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import LanguageSwitcher from "../../../components/ui/LanguageSwitcher";
import { useTheme } from "../../../components/ui/ThemeProvider";
import Logo from "../../../components/ui/Logo";
import { 
  MenuIcon, 
  SearchIcon, 
  ThemeIcon, 
  NotificationIcon 
} from "./Icons";

const Header = ({ 
  onToggleMobileSidebar, 
  showBackButton = false, 
  backButtonText = "← Back", 
  onBackClick,
  showSearch = true,
  themeColor = "bg-teal-600"
}) => {
  const { toggleTheme } = useTheme();

  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center space-x-3">
          <button className="md:hidden" onClick={onToggleMobileSidebar}>
            <MenuIcon />
          </button>
          
          {showBackButton && (
            <Button 
              variant="outline" 
              onClick={onBackClick}
              className="text-sm"
            >
              {backButtonText}
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <Logo />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {showSearch && (
            <div className="relative hidden md:block">
              <input 
                type="text"
                placeholder="Search..."
                className="bg-secondary/50 rounded-full px-4 py-1.5 pl-10 text-sm w-48 md:w-64"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <SearchIcon />
              </span>
            </div>
          )}
          
          <LanguageSwitcher />
          
          <button 
            className="rounded-full bg-secondary/50 p-2 hidden md:block"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <ThemeIcon />
          </button>
          
          <button className="rounded-full bg-secondary/50 p-2 relative">
            <NotificationIcon />
            <span className={`absolute top-0 right-0 ${themeColor} text-white rounded-full text-xs w-4 h-4 flex items-center justify-center`}>2</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 