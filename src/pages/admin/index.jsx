import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/dashboard/layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Settings, 
  FileText, 
  Users, 
  BarChart3, 
  Shield, 
  Database,
  Wrench,
  FormInput 
} from 'lucide-react';
import { createSafeTranslate } from '../../utils/translationUtils';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);

  const adminTools = [
    {
      title: 'Form Configuration Tool',
      description: 'Configure custom forms for different services and clients',
      icon: FormInput,
      href: '/admin/config-tool',
      color: 'bg-blue-500',
      featured: true
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-purple-500'
    },
    {
      title: 'Reports & Analytics',
      description: 'View reports and analytics dashboards',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-orange-500'
    },
    {
      title: 'Security & Access',
      description: 'Manage security settings and access controls',
      icon: Shield,
      href: '/admin/security',
      color: 'bg-red-500'
    },
    {
      title: 'Database Management',
      description: 'Database backup, restore, and maintenance',
      icon: Database,
      href: '/admin/database',
      color: 'bg-gray-500'
    },
    {
      title: 'System Maintenance',
      description: 'System health, logs, and maintenance tasks',
      icon: Wrench,
      href: '/admin/maintenance',
      color: 'bg-yellow-500'
    },
    {
      title: 'Document Templates',
      description: 'Manage document templates and layouts',
      icon: FileText,
      href: '/admin/templates',
      color: 'bg-indigo-500'
    }
  ];

  const featuredTools = adminTools.filter(tool => tool.featured);
  const regularTools = adminTools.filter(tool => !tool.featured);

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">
              {safeTranslate('admin.dashboard.title', 'Admin Dashboard')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {safeTranslate('admin.dashboard.description', 'Manage system configuration and administrative tasks')}
            </p>
          </div>

          {/* Featured Tools */}
          {featuredTools.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Featured Tools</h2>
              <div className="grid gap-6">
                {featuredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={tool.href} className="border-2 border-dashed border-blue-200 bg-blue-50/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${tool.color} text-white`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">{tool.title}</h3>
                              <p className="text-gray-600 mt-1">{tool.description}</p>
                              <div className="mt-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New Feature
                                </span>
                              </div>
                            </div>
                          </div>
                          <Link to={tool.href}>
                            <Button size="lg" className="ml-4">
                              Open Tool
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Tools */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Administrative Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card key={tool.href} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-base">{tool.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      <Link to={tool.href}>
                        <Button variant="outline" size="sm" className="w-full">
                          Access Tool
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <div className="text-sm text-gray-600">System Status</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">Fast</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  View System Logs
                </Button>
                <Button variant="outline" size="sm">
                  Backup Database
                </Button>
                <Button variant="outline" size="sm">
                  Clear Cache
                </Button>
                <Button variant="outline" size="sm">
                  Update System
                </Button>
                <Button variant="outline" size="sm">
                  Export Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 