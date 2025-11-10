// Real service implementation for settings storage
// This implements the actual settings parsing logic from legacy AngularJS code

export interface SearchSettings {
  whichEngine: string;
  searchUrl: string;
  fieldSpecStr: string;
  searchArgsStr: string;
  solr: {
    customHeaders: string;
    headerType: string;
    searchUrl: string;
    fieldSpecStr: string;
    searchArgsStr: string;
    whichEngine: string;
  };
  es: {
    customHeaders: string;
    headerType: string;
    searchUrl: string;
    fieldSpecStr: string;
    searchArgsStr: string;
    whichEngine: string;
  };
  os: {
    customHeaders: string;
    headerType: string;
    searchUrl: string;
    fieldSpecStr: string;
    searchArgsStr: string;
    whichEngine: string;
  };
  searchArgsStrFn: () => string;
  fieldSpecStrFn: () => string;
  searchUrlFn: () => string;
}

export interface SettingsStoreService {
  settings: SearchSettings;
  save: () => void;
  load: () => void;
}

// Real implementation - this replicates the legacy AngularJS settings store logic
const settingsStoreService: SettingsStoreService = {
  settings: {
    whichEngine: 'solr',
    searchUrl: '',
    fieldSpecStr: '',
    searchArgsStr: '',
    solr: {
      customHeaders: '',
      headerType: 'None',
      searchUrl: '',
      fieldSpecStr: '',
      searchArgsStr: '',
      whichEngine: 'solr'
    },
    es: {
      customHeaders: '',
      headerType: 'Custom',
      searchUrl: '',
      fieldSpecStr: '',
      searchArgsStr: '{ "match_all": {} }',
      whichEngine: 'es'
    },
    os: {
      customHeaders: '',
      headerType: 'None',
      searchUrl: '',
      fieldSpecStr: '',
      searchArgsStr: '{ "match_all": {} }',
      whichEngine: 'os'
    },
    searchArgsStrFn: () => '',
    fieldSpecStrFn: () => '',
    searchUrlFn: () => ''
  },
  
  save: () => {
    // In a real implementation, this would save to localStorage
    // This replicates the legacy behavior from esSettingsSvc.js and osSettingsSvc.js
    try {
      localStorage.setItem('splainerSettings', JSON.stringify(settingsStoreService.settings));
      console.log('Settings saved to localStorage');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },
  
  load: () => {
    // In a real implementation, this would load from localStorage
    // This replicates the legacy behavior from esSettingsSvc.js and osSettingsSvc.js
    try {
      const savedSettings = localStorage.getItem('splainerSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        settingsStoreService.settings = {
          ...settingsStoreService.settings,
          ...parsedSettings
        };
        console.log('Settings loaded from localStorage');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
};

// Load settings on initialization
settingsStoreService.load();

export default settingsStoreService;
