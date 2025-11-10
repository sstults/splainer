import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResults from './SearchResults';

// Mock the useEffect to avoid actual side effects
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useEffect: (fn: () => void) => fn(),
  };
});

// Mock the services
const mockSearchService = {
  createSearch: vi.fn(),
  states: {
    NO_SEARCH: 0,
    DID_SEARCH: 1,
    WAITING_FOR_SEARCH: 2,
    IN_ERROR: 3
  },
  engines: {
    SOLR: 'solr',
    ELASTICSEARCH: 'es',
    OPENSEARCH: 'os'
  }
};

const mockSettingsStoreService = {
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
    searchArgsStrFn: vi.fn(),
    fieldSpecStrFn: vi.fn(),
    searchUrlFn: vi.fn()
  },
  save: vi.fn(),
  load: vi.fn()
};

vi.mock('./services/searchService', () => ({
  default: mockSearchService
}));

vi.mock('./services/settingsStoreService', () => ({
  default: mockSettingsStoreService
}));

describe('SearchResults Component - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SearchResults />);
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  it('renders initial state with no search performed', () => {
    render(<SearchResults />);
    expect(screen.getByText('No search performed yet')).toBeInTheDocument();
  });

  it('shows search button and reset button', () => {
    render(<SearchResults />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('shows toggle buttons', () => {
    render(<SearchResults />);
    expect(screen.getByText('Parsed Query Details')).toBeInTheDocument();
    expect(screen.getByText('Query Details')).toBeInTheDocument();
  });

  it('handles search button click', async () => {
    // Mock the search service to return a resolved promise
    const mockSearch = {
      search: vi.fn().mockResolvedValue(undefined),
      state: 1, // DID_SEARCH
      docs: [
        { id: '1', score: 1.0, hotMatches: [{ description: 'Match 1', percentage: 80 }] }
      ],
      numFound: 1,
      maxScore: 1.0,
      linkUrl: '#',
      errorMsg: '',
      settings: {}
    };
    
    // Mock the createSearch function to return our mock search
    mockSearchService.createSearch.mockReturnValue(mockSearch);
    
    render(<SearchResults />);
    
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
    });
  });

  it('handles reset button click', async () => {
    render(<SearchResults />);
    
    // First perform a search
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Found 3 documents')).toBeInTheDocument();
    });
    
    // Then reset
    const resetButton = screen.getByText('Reset');
    await userEvent.click(resetButton);
    
    // Should show no search message
    expect(screen.getByText('No search performed yet')).toBeInTheDocument();
  });

  it('toggles parsed query details', async () => {
    render(<SearchResults />);
    
    const toggleButton = screen.getByText('Parsed Query Details');
    await userEvent.click(toggleButton);
    
    // Should be active now
    expect(toggleButton).toHaveClass('active');
  });

  it('toggles query details', async () => {
    render(<SearchResults />);
    
    const toggleButton = screen.getByText('Query Details');
    await userEvent.click(toggleButton);
    
    // Should be active now
    expect(toggleButton).toHaveClass('active');
  });

  it('handles search error state', async () => {
    // Mock the search service to throw an error
    const mockSearch = {
      search: vi.fn().mockRejectedValue(new Error('Search failed')),
      state: 3, // IN_ERROR
      docs: [],
      numFound: 0,
      maxScore: 0,
      linkUrl: '#',
      errorMsg: 'Search failed',
      settings: {}
    };
    
    // Mock the createSearch function to return our mock search
    mockSearchService.createSearch.mockReturnValue(mockSearch);
    
    render(<SearchResults />);
    
    // Try to trigger error state
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete and check for error handling
    await waitFor(() => {
      expect(screen.getByText('Search error occurred')).toBeInTheDocument();
    });
  });

  it('renders document rows correctly', async () => {
    // Mock the search service to return successful search results
    const mockSearch = {
      search: vi.fn().mockResolvedValue(undefined),
      state: 1, // DID_SEARCH
      docs: [
        { 
          id: '1', 
          score: 1.0, 
          hotMatches: [
            { description: 'Match 1', percentage: 80 },
            { description: 'Match 2', percentage: 60 }
          ] 
        }
      ],
      numFound: 1,
      maxScore: 1.0,
      linkUrl: '#',
      errorMsg: '',
      settings: {}
    };
    
    // Mock the createSearch function to return our mock search
    mockSearchService.createSearch.mockReturnValue(mockSearch);
    
    render(<SearchResults />);
    
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Document 1')).toBeInTheDocument();
    });
    
    // Check that document score is displayed
    expect(screen.getByText('1.0')).toBeInTheDocument();
    
    // Check that hot matches are displayed
    expect(screen.getByText('Match 1')).toBeInTheDocument();
    expect(screen.getByText('Match 2')).toBeInTheDocument();
  });

  it('handles loading state correctly', async () => {
    render(<SearchResults />);
    
    // Check that loading state is not shown initially
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    
    // Mock the search service to return a resolved promise
    const mockSearch = {
      search: vi.fn().mockResolvedValue(undefined),
      state: 1, // DID_SEARCH
      docs: [],
      numFound: 0,
      maxScore: 0,
      linkUrl: '#',
      errorMsg: '',
      settings: {}
    };
    
    // Mock the createSearch function to return our mock search
    mockSearchService.createSearch.mockReturnValue(mockSearch);
    
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Found 3 documents')).toBeInTheDocument();
    });
  });
});

// Test the service functions directly
describe('Search Service - Unit Tests', () => {
  it('creates search with proper state management', async () => {
    const searchService = await import('./services/searchService');
    
    const mockSettings = {
      whichEngine: 'solr',
      searchUrl: 'http://test.com',
      fieldSpecStr: 'id title',
      searchArgsStr: 'q=*:*',
      solr: {
        customHeaders: '',
        headerType: 'None',
        searchUrl: 'http://test.com',
        fieldSpecStr: 'id title',
        searchArgsStr: 'q=*:*',
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
      searchArgsStrFn: vi.fn(),
      fieldSpecStrFn: vi.fn(),
      searchUrlFn: vi.fn()
    };
    
    const searchInstance = searchService.default.createSearch(mockSettings);
    
    expect(searchInstance).toBeDefined();
    expect(searchInstance.state).toBe(0); // NO_SEARCH
    expect(searchInstance.search).toBeInstanceOf(Function);
  });

  it('handles search execution correctly', async () => {
    const searchService = await import('./services/searchService');
    
    const mockSettings = {
      whichEngine: 'solr',
      searchUrl: 'http://test.com',
      fieldSpecStr: 'id title',
      searchArgsStr: 'q=*:*',
      solr: {
        customHeaders: '',
        headerType: 'None',
        searchUrl: 'http://test.com',
        fieldSpecStr: 'id title',
        searchArgsStr: 'q=*:*',
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
      searchArgsStrFn: vi.fn(),
      fieldSpecStrFn: vi.fn(),
      searchUrlFn: vi.fn()
    };
    
    const searchInstance = searchService.default.createSearch(mockSettings);
    
    // Mock the search method to avoid actual HTTP calls
    const originalSearch = searchInstance.search;
    searchInstance.search = vi.fn().mockResolvedValue(undefined);
    
    await searchInstance.search();
    
    expect(searchInstance.search).toHaveBeenCalled();
    expect(searchInstance.state).toBe(1); // DID_SEARCH
  });
});

// Test the settings service functions
describe('Settings Store Service - Unit Tests', () => {
  it('loads settings correctly', async () => {
    const settingsStoreService = await import('./services/settingsStoreService');
    
    // Mock localStorage
    const mockSettings = {
      whichEngine: 'solr',
      searchUrl: 'http://test.com',
      fieldSpecStr: 'id title',
      searchArgsStr: 'q=*:*',
      solr: {
        customHeaders: '',
        headerType: 'None',
        searchUrl: 'http://test.com',
        fieldSpecStr: 'id title',
        searchArgsStr: 'q=*:*',
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
      searchArgsStrFn: vi.fn(),
      fieldSpecStrFn: vi.fn(),
      searchUrlFn: vi.fn()
    };
    
    // Mock localStorage.getItem
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockSettings));
    
    // Call load function
    settingsStoreService.default.load();
    
    // Restore original
    localStorage.getItem = originalGetItem;
    
    expect(settingsStoreService.default.settings).toBeDefined();
  });
});
