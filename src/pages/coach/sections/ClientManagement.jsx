import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  FormIcon 
} from "../components/Icons";
import { filterClients } from "../utils/clientUtils";

const ClientManagement = ({ 
  clients = [], 
  loadingClients = false,
  searchTerm = "",
  filterStatus = "",
  onSearchChange,
  onFilterChange,
  onCreateClient,
  onEditClient,
  onDeleteClient,
  onToggleClientStatus,
  onShowClientForms,
  themeColor = "bg-teal-600",
  themeColorHover = "hover:bg-teal-700"
}) => {
  const filteredClients = filterClients(clients, searchTerm, filterStatus);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Client Management Header */}
        <Card className="shadow-sm mb-6">
          <CardHeader className="bg-background border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold">
                Client Management ({filteredClients.length})
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-48"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button 
                  onClick={onCreateClient}
                  className={`${themeColor} ${themeColorHover} text-white`}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Client
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingClients ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-lg font-medium mb-2">No clients found</p>
                <p className="text-sm">
                  {clients.length === 0 
                    ? "Create your first client to get started"
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredClients.map((client) => (
                  <div key={client.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://randomuser.me/api/portraits/${client.id % 2 === 0 ? 'women' : 'men'}/${20 + client.id}.jpg`} 
                          alt={`${client.firstName} ${client.lastName}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">
                            {client.firstName} {client.lastName}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{client.email}</span>
                            <span>{client.phone}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {client.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Profile: {client.profileCompletion}%</span>
                            <span>Forms: {client.formsCompleted}/{client.totalForms}</span>
                            <span>Joined: {new Date(client.joinDate).toLocaleDateString()}</span>
                            <span>Last Active: {new Date(client.lastActivity).toLocaleDateString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${client.profileCompletion}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditClient(client)}
                          className="text-xs"
                        >
                          <EditIcon className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onShowClientForms(client)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          <FormIcon className="w-3 h-3 mr-1" />
                          Forms
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleClientStatus(client.id)}
                          className={`text-xs ${client.status === 'active' ? 'text-orange-600' : 'text-green-600'}`}
                        >
                          {client.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteClient(client.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ClientManagement; 