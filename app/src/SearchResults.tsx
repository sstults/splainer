import React, { useState, useEffect } from 'react';

interface Doc {
  id: string;
  score: number;
  // Add other document fields as needed
}

interface SearchState {
  docs: Doc[];
  numFound: number;
  maxScore: number;
  state: number;
  errorMsg: string;
}

const SearchResults: React.FC = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    docs: [],
    numFound: 0,
    maxScore: 0,
    state: 0, // NO_SEARCH
    errorMsg: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showParsedQueryDetails, setShowParsedQueryDetails] = useState(false);
  const [showQueryDetails, setShowQueryDetails] = useState(false);

  // Mock search functionality based on legacy code analysis
  const search = async () => {
    setIsLoading(true);
    setShowParsedQueryDetails(false);
    setShowQueryDetails(false);
    
    try {
      // Simulate search operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results
      const mockDocs: Doc[] = [
        { id: '1', score: 1.5 },
        { id: '2', score: 1.2 },
        { id: '3', score: 1.0 },
      ];
      
      setSearchState({
        docs: mockDocs,
        numFound: mockDocs.length,
        maxScore: Math.max(...mockDocs.map(doc => doc.score)),
        state: 1, // DID_SEARCH
        errorMsg: ''
      });
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        state: 3, // IN_ERROR
        errorMsg: 'Search failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSearchState({
      docs: [],
      numFound: 0,
      maxScore: 0,
      state: 0, // NO_SEARCH
      errorMsg: ''
    });
    setShowParsedQueryDetails(false);
    setShowQueryDetails(false);
  };

  // Initialize search
  useEffect(() => {
    reset();
  }, []);

  return (
    <div className="search-results">
      <div className="search-controls">
        <button onClick={search} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={reset}>Reset</button>
        
        <div className="toggle-buttons">
          <button 
            onClick={() => setShowParsedQueryDetails(!showParsedQueryDetails)}
            className={showParsedQueryDetails ? 'active' : ''}
          >
            Parsed Query Details
          </button>
          <button 
            onClick={() => setShowQueryDetails(!showQueryDetails)}
            className={showQueryDetails ? 'active' : ''}
          >
            Query Details
          </button>
        </div>
      </div>

      {searchState.errorMsg && (
        <div className="error-message">
          {searchState.errorMsg}
        </div>
      )}

      {searchState.state === 1 && (
        <div className="search-results-container">
          <div className="results-header">
            <span>Found {searchState.numFound} documents</span>
            <span>Max Score: {searchState.maxScore}</span>
          </div>
          
          <div className="documents">
            {searchState.docs.map((doc) => (
              <div key={doc.id} className="document">
                <div className="doc-id">ID: {doc.id}</div>
                <div className="doc-score">Score: {doc.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchState.state === 0 && (
        <div className="no-search">
          <p>No search performed yet</p>
        </div>
      )}

      {searchState.state === 3 && (
        <div className="search-error">
          <p>Search error occurred</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
