import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { 
  HomeIcon, 
  ProfileIcon, 
  ClientsIcon, 
  FormsIcon, 
  LogoutIcon,
  CollapseIcon,
  ExpandIcon
} from "./Icons";

const Sidebar = ({ 
  activeMenuItem, 
  onMenuClick, 
  onLogout, 
  sidebarCollapsed, 
  onToggleSidebar, 
  showMobileSidebar,
  clients = [],
  themeColor = "bg-teal-600",
  themeLightBg = "bg-teal-500/10"
}) => {
  const { user } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <HomeIcon /> },
    { id: "profile", label: "Profile", icon: <ProfileIcon /> },
    { id: "clients", label: "Manage Clients", icon: <ClientsIcon /> },
    { id: "forms", label: "Manage Forms", icon: <FormsIcon /> }
  ];

  return (
    <div 
      className={`
        ${showMobileSidebar ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} 
        md:flex md:relative md:z-auto 
        ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'} 
        bg-card border-r border-border transition-all duration-300
      `}
    >
      <div className="flex flex-col h-full">
        <div className={`${themeColor} p-4 flex items-center justify-between`}>
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">Coach</h1>}
          <button 
            onClick={onToggleSidebar} 
            className="text-white p-1 rounded-md hover:bg-black/10 hidden md:block"
          >
            {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        </div>
        
        <div className="p-4 flex-1">
          {!sidebarCollapsed && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Coach" 
                  className="w-12 h-12 rounded-full border-2 border-blue-200"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-foreground">Sarah Johnson</h2>
                  <p className="text-xs text-muted-foreground">Certified Financial Coach</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Clients</span>
                  <span className="font-medium">{clients.length}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Active</span>
                  <span className="font-medium">{clients.filter(c => c.status === 'active').length}</span>
                </div>
              </div>
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Coach" 
                  className="w-10 h-10 rounded-full border-2 border-blue-200"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          )}
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuClick(item.id)}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors w-full text-left ${
                  activeMenuItem === item.id
                    ? `${themeColor} text-white`
                    : `text-foreground hover:${themeLightBg}`
                }`}
              >
                <span>{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
            
            <button
              onClick={onLogout}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors text-foreground hover:bg-red-500/10 mt-8 w-full text-left`}
            >
              <span><LogoutIcon /></span>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 