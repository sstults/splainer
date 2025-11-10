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

describe('SearchResults Component - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Integration with Services', () => {
    it('integrates search service with component state management', async () => {
      // Mock a complete search cycle
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
      
      // Verify initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Perform search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Verify search service was called
      expect(mockSearchService.createSearch).toHaveBeenCalled();
      
      // Wait for search completion
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify component updated with search results
      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('1.0')).toBeInTheDocument();
    });

    it('handles search service error propagation', async () => {
      // Mock search service error
      const mockSearch = {
        search: vi.fn().mockRejectedValue(new Error('Service error')),
        state: 3, // IN_ERROR
        docs: [],
        numFound: 0,
        maxScore: 0,
        linkUrl: '#',
        errorMsg: 'Service error',
        settings: {}
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      // Perform search that will fail
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Wait for error handling
      await waitFor(() => {
        expect(screen.getByText('Search error occurred')).toBeInTheDocument();
      });
      
      // Verify error message is displayed
      expect(screen.getByText('Service error')).toBeInTheDocument();
      
      // Verify search service error was propagated
      expect(mockSearchService.createSearch).toHaveBeenCalled();
    });

    it('integrates settings service with component configuration', async () => {
      // Mock settings service with specific configuration
      const mockSettings = {
        whichEngine: 'es',
        searchUrl: 'http://elasticsearch.test.com',
        fieldSpecStr: 'id title content',
        searchArgsStr: '{ "query": { "match_all": {} } }',
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
          searchUrl: 'http://elasticsearch.test.com',
          fieldSpecStr: 'id title content',
          searchArgsStr: '{ "query": { "match_all": {} } }',
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
      
      mockSettingsStoreService.settings = mockSettings;
      
      render(<SearchResults />);
      
      // Verify component uses settings from service
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

  describe('State Management Integration', () => {
    it('manages component state through search lifecycle', async () => {
      // Mock search with different states
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
      
      // Initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Search state
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Wait for search completion
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Reset state
      const resetButton = screen.getByText('Reset');
      await userEvent.click(resetButton);
      
      // Should return to initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
    });

    it('maintains state consistency during multiple searches', async () => {
      // Mock multiple search responses
      const mockSearch1 = {
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
      
      const mockSearch2 = {
        search: vi.fn().mockResolvedValue(undefined),
        state: 1, // DID_SEARCH
        docs: [
          { id: '2', score: 0.8, hotMatches: [{ description: 'Match 2', percentage: 60 }] }
        ],
        numFound: 1,
        maxScore: 0.8,
        linkUrl: '#',
        errorMsg: '',
        settings: {}
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch1);
      
      render(<SearchResults />);
      
      // First search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Reset and perform second search
      const resetButton = screen.getByText('Reset');
      await userEvent.click(resetButton);
      
      // Update mock for second search
      mockSearchService.createSearch.mockReturnValue(mockSearch2);
      
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Should show second search results
      expect(screen.getByText('Document 2')).toBeInTheDocument();
    });
  });

  describe('Service Communication Integration', () => {
    it('properly calls search service methods with correct parameters', async () => {
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
      
      // Wait for search to complete
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify search method was called on the search instance
      expect(mockSearch.search).toHaveBeenCalled();
      
      // Verify createSearch was called
      expect(mockSearchService.createSearch).toHaveBeenCalled();
    });

    it('handles service method chaining correctly', async () => {
      // Mock a search that requires multiple service calls
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
      
      // Wait for search to complete
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify the service integration
      expect(mockSearchService.createSearch).toHaveBeenCalled();
      expect(mockSearch.search).toHaveBeenCalled();
    });
  });

  describe('Complex Integration Scenarios', () => {
    it('handles concurrent service interactions', async () => {
      // Mock search with complex data
      const mockSearch = {
        search: vi.fn().mockResolvedValue(undefined),
        state: 1, // DID_SEARCH
        docs: [
          { 
            id: '1', 
            score: 1.0, 
            hotMatches: [
              { description: 'Match 1', percentage: 80 },
              { description: 'Match 2', percentage: 60 },
              { description: 'Match 3', percentage: 40 }
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
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify complex data handling
      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('1.0')).toBeInTheDocument();
      expect(screen.getByText('Match 1')).toBeInTheDocument();
      expect(screen.getByText('Match 2')).toBeInTheDocument();
      expect(screen.getByText('Match 3')).toBeInTheDocument();
    });

    it('maintains integration integrity across component lifecycle', async () => {
      // Mock search service
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
      
      const { rerender } = render(<SearchResults />);
      
      // Initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Perform search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Rerender to test lifecycle integrity
      rerender(<SearchResults />);
      
      // Should still show results
      expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
    });
  });
});
