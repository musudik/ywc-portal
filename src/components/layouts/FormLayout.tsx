import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../ui/ThemeProvider';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import Logo from '../ui/Logo';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Container, Paper } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, Link } from 'react-router-dom';

interface FormLayoutProps {
  children: React.ReactNode;
  title?: string;
}

// Define a flexible user type to accommodate different shapes
interface UserType {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string | { name: string; [key: string]: any };
  [key: string]: any;
}

// Define auth context type
interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, title = 'Form' }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth() as AuthContextType;
  const { theme, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  
  // Extract user name from user object, handling multiple possible data formats
  let userName = 'User';
  if (user) {
    if (user.displayName) {
      userName = user.displayName;
    } else if (user.firstName || user.lastName) {
      userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    } else if (user.name) {
      userName = user.name;
    }
  }
  
  // Extract user role
  let userRole = 'Client';
  if (user && user.role) {
    if (typeof user.role === 'string') {
      userRole = user.role;
    } else if (typeof user.role === 'object' && user.role.name) {
      userRole = user.role.name;
    }
  }
  
  const userAvatar = `https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=1DB954&color=fff`;
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        color="default" 
        elevation={0} 
        sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Link to="/client/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo width={40} height={40} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  ml: 1,
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
                YourWealth.Coach
              </Typography>
            </Link>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
              {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            <LanguageSwitcher />
            
            {user && (
              <>
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    src={userAvatar} 
                    alt={userName}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                    {userName}
                  </Typography>
                  <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {userRole}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/client/dashboard')}>{t('Dashboard')}</MenuItem>
                  <MenuItem onClick={() => handleNavigation('/client/profile')}>{t('Profile')}</MenuItem>
                  <MenuItem onClick={() => handleNavigation('/client/settings')}>{t('Settings')}</MenuItem>
                  <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mb: 4, 
              color: 'success.main',
              fontWeight: 'bold'
            }}
          >
            {title}
          </Typography>
          
          {children}
        </Paper>
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} YourWealth.Coach
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default FormLayout; 