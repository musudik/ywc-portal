import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { 
  PlusIcon, 
  ClientsIcon, 
  CalendarIcon, 
  FormsIcon,
  ClockIcon,
  ActivityIcon,
  TrendingUpIcon,
  UsersIcon,
  TargetIcon,
  ClipboardIcon,
  CheckCircleIcon,
  MessageIcon,
  EditIcon
} from "../components/Icons";

const DashboardHome = ({ 
  clients = [], 
  loadingClients = false, 
  onCreateClient, 
  onManageClients, 
  onEditClient,
  themeColor = "bg-teal-600",
  themeColorHover = "hover:bg-teal-700",
  themeLightBg = "bg-teal-500/10"
}) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Coach!</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your clients today.</p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <ClockIcon />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className={`${themeLightBg} p-4 md:p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Clients</h3>
                <p className="text-2xl font-bold">{loadingClients ? "..." : clients.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {clients.filter(c => c.status === 'active').length} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className={`${themeLightBg} p-4 md:p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Profile Completion</h3>
                <p className="text-2xl font-bold">
                  {loadingClients ? "..." : clients.length > 0 ? Math.round(clients.reduce((sum, c) => sum + c.profileCompletion, 0) / clients.length) + "%" : "0%"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average across all clients
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TargetIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className={`${themeLightBg} p-4 md:p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Forms Completed</h3>
                <p className="text-2xl font-bold">
                  {loadingClients ? "..." : clients.reduce((sum, c) => sum + c.formsCompleted, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total across all clients
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ClipboardIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className={`${themeLightBg} p-4 md:p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">This Month</h3>
                <p className="text-2xl font-bold">
                  {clients.filter(c => {
                    const joinDate = new Date(c.joinDate);
                    const now = new Date();
                    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  New clients joined
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUpIcon />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <ActivityIcon className="mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={onCreateClient}
              className={`${themeColor} ${themeColorHover} text-white w-full justify-start`}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
            <Button 
              onClick={onManageClients}
              variant="outline" 
              className="w-full justify-start"
            >
              <ClientsIcon className="mr-2 h-4 w-4" />
              Manage Clients
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <FormsIcon className="mr-2 h-4 w-4" />
              View All Forms
            </Button>
          </CardContent>
        </Card>

        {/* Recent Client Activity */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold flex items-center">
                <ClockIcon className="mr-2" />
                Recent Client Activity
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onManageClients}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingClients ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading client data...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-4">👥</div>
                  <p className="text-lg font-medium mb-2">No clients yet</p>
                  <p className="text-sm">Add your first client to get started</p>
                  <Button 
                    onClick={onCreateClient}
                    className={`${themeColor} ${themeColorHover} text-white mt-4`}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add First Client
                  </Button>
                </div>
              ) : (
                clients.slice(0, 5).map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={`https://randomuser.me/api/portraits/${client.id % 2 === 0 ? 'women' : 'men'}/${20 + (client.id || 1)}.jpg`} 
                        alt="Client" 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          Profile: {client.profileCompletion}% complete • 
                          Last active: {new Date(client.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${client.profileCompletion}%` }}
                        ></div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onEditClient(client)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold flex items-center">
                <CalendarIcon className="mr-2" />
                Upcoming Sessions
              </CardTitle>
              <Button size="sm" className={`${themeColor} ${themeColorHover} text-white`}>
                <CalendarIcon className="mr-2 h-4 w-4" /> 
                Schedule New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: "John Smith", type: "Initial Assessment", time: "Today, 3:00 PM", status: "confirmed" },
                { client: "Sarah Johnson", type: "Follow-up Session", time: "Tomorrow, 10:00 AM", status: "pending" },
                { client: "Mike Wilson", type: "Financial Review", time: "Dec 28, 2:00 PM", status: "confirmed" }
              ].map((session, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                  <div className={`${themeColor} rounded-full p-2 text-white flex-shrink-0`}>
                    <CalendarIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{session.type}</p>
                        <p className="text-sm text-muted-foreground">{session.client}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{session.time}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Join Meeting
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <TargetIcon className="mr-2" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Client Onboarding</span>
                  <span className="text-sm text-muted-foreground">
                    {clients.filter(c => c.profileCompletion >= 80).length}/{clients.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${clients.length > 0 ? (clients.filter(c => c.profileCompletion >= 80).length / clients.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Active Engagement</span>
                  <span className="text-sm text-muted-foreground">
                    {clients.filter(c => c.status === 'active').length}/{clients.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${clients.length > 0 ? (clients.filter(c => c.status === 'active').length / clients.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Form Completion Rate</span>
                  <span className="text-sm text-muted-foreground">
                    {clients.reduce((sum, c) => sum + c.formsCompleted, 0)}/{clients.length * 8}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${clients.length > 0 ? (clients.reduce((sum, c) => sum + c.formsCompleted, 0) / (clients.length * 8)) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">This Month's Goals</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>New Clients</span>
                    <span className="font-medium">5/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sessions Completed</span>
                    <span className="font-medium">12/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forms Processed</span>
                    <span className="font-medium">25/40</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activities & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <ActivityIcon className="mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  type: 'profile_update', 
                  client: 'Emily Parker', 
                  action: 'Updated employment details', 
                  time: '2 hours ago',
                  icon: <EditIcon />,
                  color: 'bg-blue-500'
                },
                { 
                  type: 'form_submission', 
                  client: 'Michael Thompson', 
                  action: 'Submitted risk assessment form', 
                  time: '4 hours ago',
                  icon: <ClipboardIcon />,
                  color: 'bg-green-500'
                },
                { 
                  type: 'session_completed', 
                  client: 'Sarah Wilson', 
                  action: 'Completed initial consultation', 
                  time: '1 day ago',
                  icon: <CheckCircleIcon />,
                  color: 'bg-purple-500'
                },
                { 
                  type: 'message', 
                  client: 'John Smith', 
                  action: 'Sent a message about investment goals', 
                  time: '2 days ago',
                  icon: <MessageIcon />,
                  color: 'bg-orange-500'
                },
                { 
                  type: 'new_client', 
                  client: 'Lisa Chen', 
                  action: 'Joined as a new client', 
                  time: '3 days ago',
                  icon: <PlusIcon />,
                  color: 'bg-indigo-500'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`${activity.color} rounded-full p-2 text-white flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.client}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <TrendingUpIcon className="mr-2" />
              Insights & Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Client Engagement</h4>
                  <span className="text-sm font-medium text-blue-600">+15%</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Client activity has increased this month compared to last month.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900 dark:text-green-100">Form Completion</h4>
                  <span className="text-sm font-medium text-green-600">+8%</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  More clients are completing their profile forms on time.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">Session Success</h4>
                  <span className="text-sm font-medium text-purple-600">92%</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  High satisfaction rate from completed coaching sessions.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">Quick Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Follow up with clients who haven't completed their profiles
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Schedule regular check-ins to maintain engagement
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Use the Forms feature to gather comprehensive client data
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DashboardHome; 