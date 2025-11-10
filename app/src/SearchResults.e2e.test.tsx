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

describe('SearchResults Component - End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete User Flow Tests', () => {
    it('executes complete search workflow from start to finish', async () => {
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
      
      // Step 1: Verify initial state
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
      
      // Step 2: Perform search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Step 3: Verify search is in progress
      // Note: No explicit loading state in current implementation
      
      // Step 4: Wait for search completion
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Step 5: Verify results are displayed
      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('1.0')).toBeInTheDocument();
      expect(screen.getByText('Match 1')).toBeInTheDocument();
      
      // Step 6: Verify all expected elements are present
      expect(screen.getByText('Parsed Query Details')).toBeInTheDocument();
      expect(screen.getByText('Query Details')).toBeInTheDocument();
    });

    it('handles complete user interaction cycle', async () => {
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
      
      // Initial state verification
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Search interaction
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Toggle interactions
      const parsedQueryButton = screen.getByText('Parsed Query Details');
      await userEvent.click(parsedQueryButton);
      expect(parsedQueryButton).toHaveClass('active');
      
      const queryButton = screen.getByText('Query Details');
      await userEvent.click(queryButton);
      expect(queryButton).toHaveClass('active');
      
      // Reset interaction
      const resetButton = screen.getByText('Reset');
      await userEvent.click(resetButton);
      
      // Final state verification
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
    });
  });

  describe('User Experience Flow Tests', () => {
    it('simulates realistic user search experience', async () => {
      // Mock search with realistic data
      const mockSearch = {
        search: vi.fn().mockResolvedValue(undefined),
        state: 1, // DID_SEARCH
        docs: [
          { 
            id: 'doc-1', 
            score: 1.0, 
            hotMatches: [
              { description: 'Full text match', percentage: 95 },
              { description: 'Title match', percentage: 70 }
            ] 
          },
          { 
            id: 'doc-2', 
            score: 0.8, 
            hotMatches: [
              { description: 'Content match', percentage: 85 }
            ] 
          }
        ],
        numFound: 2,
        maxScore: 1.0,
        linkUrl: '#',
        errorMsg: '',
        settings: {}
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      // User sees initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      
      // User clicks search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // User sees results loading
      await waitFor(() => {
        expect(screen.getByText('Found 2 documents')).toBeInTheDocument();
      });
      
      // User sees document details
      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('Document 2')).toBeInTheDocument();
      expect(screen.getByText('1.0')).toBeInTheDocument();
      expect(screen.getByText('0.8')).toBeInTheDocument();
      
      // User sees match details
      expect(screen.getByText('Full text match')).toBeInTheDocument();
      expect(screen.getByText('Title match')).toBeInTheDocument();
      expect(screen.getByText('Content match')).toBeInTheDocument();
    });

    it('handles user error recovery flow', async () => {
      // Mock search service error
      const mockSearch = {
        search: vi.fn().mockRejectedValue(new Error('Network timeout')),
        state: 3, // IN_ERROR
        docs: [],
        numFound: 0,
        maxScore: 0,
        linkUrl: '#',
        errorMsg: 'Network timeout',
        settings: {}
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      // User sees initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // User clicks search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // User sees error
      await waitFor(() => {
        expect(screen.getByText('Search error occurred')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Network timeout')).toBeInTheDocument();
      
      // User attempts to recover by clicking search again
      await userEvent.click(searchButton);
      
      // Should attempt to search again (mocked as successful)
      const mockSearchSuccess = {
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
      
      mockSearchService.createSearch.mockReturnValue(mockSearchSuccess);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
    });
  });

  describe('Complete System Integration Tests', () => {
    it('tests complete component lifecycle with service integration', async () => {
      // Mock complete service interaction
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
      
      // Render component
      const { rerender } = render(<SearchResults />);
      
      // Verify initial state
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      
      // Perform search
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify service integration
      expect(mockSearchService.createSearch).toHaveBeenCalled();
      expect(mockSearch.search).toHaveBeenCalled();
      
      // Test component rerender maintains state
      rerender(<SearchResults />);
      expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      
      // Test reset functionality
      const resetButton = screen.getByText('Reset');
      await userEvent.click(resetButton);
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
    });

    it('verifies complete data flow from service to UI', async () => {
      // Mock service with complete data flow
      const mockSearch = {
        search: vi.fn().mockResolvedValue(undefined),
        state: 1, // DID_SEARCH
        docs: [
          { 
            id: 'test-doc-1', 
            score: 0.95, 
            hotMatches: [
              { description: 'Primary match', percentage: 90 },
              { description: 'Secondary match', percentage: 60 }
            ] 
          }
        ],
        numFound: 1,
        maxScore: 0.95,
        linkUrl: '#',
        errorMsg: '',
        settings: {}
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify complete data flow
      expect(screen.getByText('Document test-doc-1')).toBeInTheDocument();
      expect(screen.getByText('0.95')).toBeInTheDocument();
      expect(screen.getByText('Primary match')).toBeInTheDocument();
      expect(screen.getByText('Secondary match')).toBeInTheDocument();
      
      // Verify percentage values
      expect(screen.getByText('90%')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });
  });

  describe('Edge Case E2E Tests', () => {
    it('handles empty search results gracefully', async () => {
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
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 0 documents')).toBeInTheDocument();
      });
      
      // Should show empty state message
      expect(screen.getByText('No documents found')).toBeInTheDocument();
    });

    it('handles multiple rapid user interactions', async () => {
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
      
      // Rapid button clicks (simulating user error)
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      await userEvent.click(searchButton);
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Should handle gracefully and show final state
      expect(screen.getByText('Document 1')).toBeInTheDocument();
    });
  });

  describe('Performance and Stability Tests', () => {
    it('maintains stability through complete user journey', async () => {
      // Mock multiple searches to test stability
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
      
      // Multiple search operations
      for (let i = 0; i < 3; i++) {
        const searchButton = screen.getByText('Search');
        await userEvent.click(searchButton);
        
        await waitFor(() => {
          expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
        });
        
        // Reset between searches
        const resetButton = screen.getByText('Reset');
        await userEvent.click(resetButton);
        
        expect(screen.getByText('No search performed yet')).toBeInTheDocument();
      }
      
      // Final state should be clean
      expect(screen.getByText('No search performed yet')).toBeInTheDocument();
    });

    it('preserves user context through component lifecycle', async () => {
      // Mock search with specific context
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
        settings: {
          whichEngine: 'es',
          searchUrl: 'http://test.com'
        }
      };
      
      mockSearchService.createSearch.mockReturnValue(mockSearch);
      
      render(<SearchResults />);
      
      const searchButton = screen.getByText('Search');
      await userEvent.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 documents')).toBeInTheDocument();
      });
      
      // Verify context is preserved
      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('1.0')).toBeInTheDocument();
    });
  });
});
