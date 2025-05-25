import api from './api';

// Form Configuration API endpoints
const FORM_CONFIG_ENDPOINTS = {
  // Get all form configurations
  getAll: '/admin/form-configurations',
  
  // Get specific form configuration by ID
  getById: (id) => `/admin/form-configurations/${id}`,
  
  // Get configurations by form type
  getByType: (formType) => `/admin/form-configurations?type=${formType}`,
  
  // Get active configurations only
  getActive: '/admin/form-configurations?active=true',
  
  // Create new form configuration
  create: '/admin/form-configurations',
  
  // Update existing form configuration
  update: (id) => `/admin/form-configurations/${id}`,
  
  // Delete form configuration
  delete: (id) => `/admin/form-configurations/${id}`,
  
  // Duplicate form configuration
  duplicate: (id) => `/admin/form-configurations/${id}/duplicate`,
  
  // Get configuration versions/history
  getVersions: (id) => `/admin/form-configurations/${id}/versions`,
  
  // Activate/Deactivate configuration
  toggleStatus: (id) => `/admin/form-configurations/${id}/toggle-status`,
  
  // Validate configuration
  validate: '/admin/form-configurations/validate',
  
  // Export configuration
  export: (id) => `/admin/form-configurations/${id}/export`,
  
  // Import configuration
  import: '/admin/form-configurations/import',
  
  // Get configuration usage statistics
  getStats: (id) => `/admin/form-configurations/${id}/stats`,
  
  // Get all form types
  getFormTypes: '/admin/form-configurations/types',
  
  // Get section field definitions
  getSectionFields: '/admin/form-configurations/section-fields',
};

/**
 * Form Configuration API service
 */
export const formConfigApi = {
  /**
   * Get all form configurations
   * @param {Object} params - Query parameters (page, limit, type, active, search)
   * @returns {Promise<Object>} List of form configurations with pagination
   */
  async getAllConfigurations(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${FORM_CONFIG_ENDPOINTS.getAll}?${queryParams}` : FORM_CONFIG_ENDPOINTS.getAll;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching form configurations:', error);
      throw new Error('Failed to fetch form configurations');
    }
  },

  /**
   * Get form configuration by ID
   * @param {string} id - Configuration ID
   * @returns {Promise<Object>} Form configuration data
   */
  async getConfigurationById(id) {
    try {
      const response = await api.get(FORM_CONFIG_ENDPOINTS.getById(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching form configuration:', error);
      throw new Error('Failed to fetch form configuration');
    }
  },

  /**
   * Get configurations by form type
   * @param {string} formType - Form type to filter by
   * @returns {Promise<Array>} List of configurations for the form type
   */
  async getConfigurationsByType(formType) {
    try {
      const response = await api.get(FORM_CONFIG_ENDPOINTS.getByType(formType));
      return response.data;
    } catch (error) {
      console.error('Error fetching configurations by type:', error);
      throw new Error('Failed to fetch configurations by type');
    }
  },

  /**
   * Get only active configurations
   * @returns {Promise<Array>} List of active configurations
   */
  async getActiveConfigurations() {
    try {
      const response = await api.get(FORM_CONFIG_ENDPOINTS.getActive);
      return response.data;
    } catch (error) {
      console.error('Error fetching active configurations:', error);
      throw new Error('Failed to fetch active configurations');
    }
  },

  /**
   * Create new form configuration
   * @param {Object} configData - Form configuration data
   * @returns {Promise<Object>} Created configuration
   */
  async createConfiguration(configData) {
    try {
      // Validate required fields
      if (!configData.name || !configData.formType) {
        throw new Error('Name and form type are required');
      }

      const payload = {
        ...configData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await api.post(FORM_CONFIG_ENDPOINTS.create, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating form configuration:', error);
      throw new Error('Failed to create form configuration');
    }
  },

  /**
   * Update existing form configuration
   * @param {string} id - Configuration ID
   * @param {Object} configData - Updated configuration data
   * @returns {Promise<Object>} Updated configuration
   */
  async updateConfiguration(id, configData) {
    try {
      const payload = {
        ...configData,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put(FORM_CONFIG_ENDPOINTS.update(id), payload);
      return response.data;
    } catch (error) {
      console.error('Error updating form configuration:', error);
      throw new Error('Failed to update form configuration');
    }
  },

  /**
   * Delete form configuration
   * @param {string} id - Configuration ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteConfiguration(id) {
    try {
      await api.delete(FORM_CONFIG_ENDPOINTS.delete(id));
      return true;
    } catch (error) {
      console.error('Error deleting form configuration:', error);
      throw new Error('Failed to delete form configuration');
    }
  },

  /**
   * Duplicate form configuration
   * @param {string} id - Configuration ID to duplicate
   * @param {Object} newData - New configuration data (name, version, etc.)
   * @returns {Promise<Object>} Duplicated configuration
   */
  async duplicateConfiguration(id, newData = {}) {
    try {
      const response = await api.post(FORM_CONFIG_ENDPOINTS.duplicate(id), newData);
      return response.data;
    } catch (error) {
      console.error('Error duplicating form configuration:', error);
      throw new Error('Failed to duplicate form configuration');
    }
  },

  /**
   * Get configuration versions/history
   * @param {string} id - Configuration ID
   * @returns {Promise<Array>} List of configuration versions
   */
  async getConfigurationVersions(id) {
    try {
      const response = await api.get(FORM_CONFIG_ENDPOINTS.getVersions(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching configuration versions:', error);
      throw new Error('Failed to fetch configuration versions');
    }
  },

  /**
   * Toggle configuration active status
   * @param {string} id - Configuration ID
   * @returns {Promise<Object>} Updated configuration
   */
  async toggleConfigurationStatus(id) {
    try {
      const response = await api.patch(FORM_CONFIG_ENDPOINTS.toggleStatus(id));
      return response.data;
    } catch (error) {
      console.error('Error toggling configuration status:', error);
      throw new Error('Failed to toggle configuration status');
    }
  },

  /**
   * Validate form configuration
   * @param {Object} configData - Configuration data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateConfiguration(configData) {
    try {
      const response = await api.post(FORM_CONFIG_ENDPOINTS.validate, configData);
      return response.data;
    } catch (error) {
      console.error('Error validating configuration:', error);
      throw new Error('Failed to validate configuration');
    }
  },

  /**
   * Export form configuration
   * @param {string} id - Configuration ID
   * @param {string} format - Export format ('json', 'pdf', 'excel')
   * @returns {Promise<Blob>} Exported file data
   */
  async exportConfiguration(id, format = 'json') {
    try {
      const response = await api.get(`${FORM_CONFIG_ENDPOINTS.export(id)}?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting configuration:', error);
      throw new Error('Failed to export configuration');
    }
  },

  /**
   * Import form configuration
   * @param {File} file - Configuration file to import
   * @returns {Promise<Object>} Imported configuration
   */
  async importConfiguration(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(FORM_CONFIG_ENDPOINTS.import, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing configuration:', error);
      throw new Error('Failed to import configuration');
    }
  },

  /**
   * Get configuration usage statistics
   * @param {string} id - Configuration ID
   * @returns {Promise<Object>} Usage statistics
   */
  async getConfigurationStats(id) {
    try {
      const response = await api.get(FORM_CONFIG_ENDPOINTS.getStats(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching configuration stats:', error);
      throw new Error('Failed to fetch configuration stats');
    }
  },

  /**
   * Get all available form types
   * @returns {Promise<Array>} List of form types
   */
  async getFormTypes() {
    try {
      const response = await api.get(FORM_CONFIG_ENDPOINTS.getFormTypes);
      return response.data;
    } catch (error) {
      console.error('Error fetching form types:', error);
      // Return default form types as fallback
      return [
        "immobilien", 
        "privateHealthInsurance", 
        "stateHealthInsurance", 
        "kfz", 
        "loans", 
        "electricity", 
        "sanuspay", 
        "gems"
      ];
    }
  },

  /**
   * Get section field definitions
   * @returns {Promise<Object>} Section field definitions
   */
  async getSectionFields() {
    try {
      const response = await api.get(FORM_CONFIG_ENDPOINTS.getSectionFields);
      return response.data;
    } catch (error) {
      console.error('Error fetching section fields:', error);
      // Return default section fields as fallback
      return {
        Personal: [],
        Family: [],
        Employment: [],
        Income: [],
        Expenses: [],
        Assets: [],
        Liabilities: [],
        Documents: []
      };
    }
  },

  /**
   * Save configuration (create or update)
   * @param {Object} configData - Configuration data
   * @returns {Promise<Object>} Saved configuration
   */
  async saveConfiguration(configData) {
    try {
      if (configData.id) {
        // Update existing configuration
        return await this.updateConfiguration(configData.id, configData);
      } else {
        // Create new configuration
        return await this.createConfiguration(configData);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw new Error('Failed to save configuration');
    }
  },

  /**
   * Search configurations
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} Search results
   */
  async searchConfigurations(query, filters = {}) {
    try {
      const params = {
        search: query,
        ...filters
      };
      
      return await this.getAllConfigurations(params);
    } catch (error) {
      console.error('Error searching configurations:', error);
      throw new Error('Failed to search configurations');
    }
  }
};

export default formConfigApi; 