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

describe('SearchResults Component - Functional Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering and State Management', () => {
    it('renders component with correct initial state', () => {
      render(<SearchResults />);
      
      // Check that the main heading is present
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      
      // Check that initial state message is displayed
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Check that buttons are present
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
      
      // Check that toggle buttons are present
      expect(screen.getByText('Parsed Query Details')).toBeInTheDocument();
      expect(screen.getByText('Query Details')).toBeInTheDocument();
    });

    it('updates state correctly during search process', async () => {
      // Mock a successful search response
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
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      // Before search, should show initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Click search button
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Should show loading state during search
      // Note: In this implementation, there's no explicit loading state, 
      // but the component should update after search completes
      
      // Wait for search to complete and check results
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Check that document information is displayed
      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('1.0')).toBeInTheDocument();
    });

    it('handles search errors gracefully', async () => {
      // Mock a search that fails
      const mockSearch = {
        search: vi.fn().mockRejectedValue(new Error('Network error')),
        state: 3, // IN_ERROR
        docs: [],
        numFound: 0,
        maxScore: 0,
        linkUrl: '#',
        errorMsg: 'Network error',
        settings: {}
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      // Click search button
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Wait for error handling
      await waitFor(() => {
        expect(screen.getByText('Search error occurred')).toBeInTheDocument();
      });
      
      // Should show error message
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  describe('User Interaction Tests', () => {
    it('handles search button click correctly', async () => {
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
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      const searchButton = screen.getByText('Search');
      
      // Before click, should be in initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Click search
      await userEvent.click(searchButton);
      
      // After click, should show results
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
    });

    it('handles reset button click correctly', async () => {
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
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      // First perform a search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Wait for search to complete
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Then reset
      const resetButton = screen.getByText('Reset');
      await userEvent.click(resetButton);
      
      // Should return to initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
    });

    it('toggles query details correctly', async () => {
      render(<SearchResults />);
      
      const toggleButton = screen.getByText('Query Details');
      
      // Initially should not be active
      expect(toggleButton).not.toHaveClass('active');
      
      // Click to activate
      await userEvent.click(toggleButton);
      
      // Should be active now
      expect(toggleButton).toHaveClass('active');
      
      // Click again to deactivate
      await userEvent.click(toggleButton);
      
      // Should not be active
      expect(toggleButton).not.toHaveClass('active');
    });

    it('toggles parsed query details correctly', async () => {
      render(<SearchResults />);
      
      const toggleButton = screen.getByText('Parsed Query Details');
      
      // Initially should not be active
      expect(toggleButton).not.toHaveClass('active');
      
      // Click to activate
      await userEvent.click(toggleButton);
      
      // Should be active now
      expect(toggleButton).toHaveClass('active');
      
      // Click again to deactivate
      await userEvent.click(toggleButton);
      
      // Should not be active
      expect(toggleButton).not.toHaveClass('active');
    });
  });

  describe('Data Display Tests', () => {
    it('displays document information correctly', async () => {
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

    it('displays multiple documents correctly', async () => {
      const mockSearch = {
        search: vi.fn().mockResolvedValue(undefined),
        state: 1, // DID_SEARCH
        docs: [
          { id: '1', score: 1.0, hotMatches: [{ description: 'Match 1', percentage: 80 }] },
          { id: '2', score: 0.8, hotMatches: [{ description: 'Match 2', percentage: 60 }] }
        ],
        numFound: 2,
        maxScore: 1.0,
        linkUrl: '#',
        errorMsg: '',
        settings: {}
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Wait for search to complete
      await waitFor(() => {
        expect(screen.getByText('Found 2 documents')).toBeInTheDocument();
      });
      
      // Check that both documents are displayed
      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('Document 2')).toBeInTheDocument();
      
      // Check that scores are displayed
      expect(screen.getByText('1.0')).toBeInTheDocument();
      expect(screen.getByText('0.8')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('integrates with search service correctly', async () => {
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
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Verify that createSearch was called
      expect(mockSearchService.createSearch).toHaveBeenCalled();
      
      // Wait for search to complete
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify that search method was called on the returned search instance
      expect(mockSearch.search).toHaveBeenCalled();
    });

    it('integrates with settings service correctly', async () => {
      // Mock the settings service to return specific settings
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
      
      // Mock the settings service
      mockSettingsStoreService.settings = mockSettings;
      
      render(<SearchResults />);
      
      // Check that component uses settings from service
      expect(mockSettingsStoreService.settings).toBeDefined();
      
      // The component should be able to access these settings
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Wait for search to complete
      await waitFor(() => {
        expect(screen.getByText('Found 3 documents')).toBeInTheDocument();
      });
    });
  });
});
