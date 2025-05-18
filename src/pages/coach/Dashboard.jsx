import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";
import { useTheme } from "../../components/ui/ThemeProvider";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/ui/Logo";

// Icon components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ThemeIcon = () => {
  const { theme } = useTheme();
  return theme === 'dark' ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
};

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ClientsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FormsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// Add a new icon for collapse/expand sidebar
const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

function CoachDashboard() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Coach theme color - Blue
  const themeColor = "bg-blue-600";
  const themeColorHover = "hover:bg-blue-700";
  const themeLightBg = "bg-blue-500/10";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <HomeIcon /> },
    { id: "profile", label: "Profile", icon: <ProfileIcon /> },
    { id: "clients", label: "Manage Clients", icon: <ClientsIcon /> },
    { id: "forms", label: "Manage Forms", icon: <FormsIcon /> }
  ];

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMobileSidebar}></div>
      )}
      
      {/* Sidebar */}
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
              onClick={toggleSidebar} 
              className="text-white p-1 rounded-md hover:bg-white/10 hidden md:block"
            >
              {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
            </button>
          </div>
          <div className="p-4 flex-1">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Coach" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-medium">Sarah Johnson</h2>
                  <p className="text-xs text-muted-foreground">Certified Coach</p>
                </div>
              </div>
            )}
            
            {sidebarCollapsed && (
              <div className="flex justify-center mb-6">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Coach" 
                  className="w-10 h-10 rounded-full"
                />
              </div>
            )}
            
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/coach/${item.id}`}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors ${
                    activeMenuItem === item.id
                      ? `${themeColor} text-white`
                      : `text-foreground hover:${themeLightBg}`
                  }`}
                  onClick={() => {
                    setActiveMenuItem(item.id);
                    setShowMobileSidebar(false);
                  }}
                >
                  <span>{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              ))}
              
              <button
                onClick={handleLogout}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors text-foreground hover:bg-red-500/10 mt-8 w-full text-left`}
              >
                <span><LogoutIcon /></span>
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center space-x-3">
              <button className="md:hidden" onClick={toggleMobileSidebar}>
                <MenuIcon />
              </button>
              <div className="flex items-center gap-2">
                <Logo />
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
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
              
              <LanguageSwitcher />
              
              <button 
                className="rounded-full bg-secondary/50 p-2 hidden md:block"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            <Card className="shadow-sm">
              <CardContent className={`${themeLightBg} p-4 md:p-6`}>
                <h3 className="text-lg font-bold mb-2">Total Clients</h3>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-muted-foreground mt-2">+2 this month</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className={`${themeLightBg} p-4 md:p-6`}>
                <h3 className="text-lg font-bold mb-2">Active Forms</h3>
                <p className="text-3xl font-bold">8</p>
                <p className="text-sm text-muted-foreground mt-2">+3 this month</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className={`${themeLightBg} p-4 md:p-6`}>
                <h3 className="text-lg font-bold mb-2">Upcoming Sessions</h3>
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-muted-foreground mt-2">Next: Today, 3:00 PM</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Upcoming Sessions</h3>
                  <Button size="sm" className={`${themeColor} ${themeColorHover} text-white`}>
                    <CalendarIcon className="mr-2 h-4 w-4" /> Schedule New
                  </Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start space-x-3 border-b border-border pb-3">
                      <div className={`${themeColor} rounded-full p-2 text-white`}>
                        <CalendarIcon />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Client Session</p>
                          <p className="text-sm text-muted-foreground">Today, 3:00 PM</p>
                        </div>
                        <p className="text-sm">John Smith - Initial Assessment</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Button size="sm" variant="outline" className="text-xs h-7">Join Meeting</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">Reschedule</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg font-bold mb-4">Client Form Submissions</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-border pb-3 space-y-2 md:space-y-0">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${20 + item}.jpg`} 
                          alt="Client" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{item % 2 === 0 ? 'Emily Parker' : 'Michael Thompson'}</p>
                          <p className="text-sm text-muted-foreground">
                            {item % 2 === 0 ? 'Weekly Progress Form' : 'Initial Assessment'}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className={`${themeColor} ${themeColorHover} text-white`}>Review</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-sm">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">Recent Client Activities</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-start space-x-3 border-b border-border pb-3">
                    <div className={`${
                      item % 3 === 0 ? 'bg-green-500' : 
                      item % 3 === 1 ? 'bg-yellow-500' : 'bg-blue-500'
                    } rounded-full p-2 text-white`}>
                      {item % 3 === 0 ? (
                        <CheckCircleIcon />
                      ) : item % 3 === 1 ? (
                        <ClipboardIcon />
                      ) : (
                        <MessageIcon />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {item % 3 === 0 
                          ? 'Completed Assignment' 
                          : item % 3 === 1 
                            ? 'Form Submitted' 
                            : 'New Message'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item % 3 === 0 
                          ? 'Emily Parker completed the weekly exercise plan' 
                          : item % 3 === 1 
                            ? 'Michael Thompson submitted the nutrition assessment form'
                            : 'New message from Sarah in the coaching chat'}
                      </p>
                      <p className="text-xs text-muted-foreground">{item} hour{item !== 1 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default CoachDashboard; 