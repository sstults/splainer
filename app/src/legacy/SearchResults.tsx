import React, { useState, useEffect } from 'react';

const SearchResults = () => {
  const [searchState, setSearchState] = useState({
    docs: [],
    numFound: 0,
    maxScore: 0,
    state: 0, // NO_SEARCH
    errorMsg: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showParsedQueryDetails, setShowParsedQueryDetails] = useState(false);
  const [showQueryDetails, setShowQueryDetails] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Mock data
  const mockSearchData = {
    numFound: 3,
    docs: [
      { 
        id: '1', 
        score: 1.5,
        hotMatches: [
          { description: 'Match 1', percentage: 40 },
          { description: 'Match 2', percentage: 30 },
          { description: 'Match 3', percentage: 20 }
        ]
      },
      { 
        id: '2', 
        score: 1.2,
        hotMatches: [
          { description: 'Match 1', percentage: 50 },
          { description: 'Match 2', percentage: 30 }
        ]
      },
      { 
        id: '3', 
        score: 1.0,
        hotMatches: [
          { description: 'Match 1', percentage: 60 }
        ]
      },
    ],
    linkUrl: 'https://solr.example.com/solr/core/select'
  };

  // Search function
  const search = async () => {
    setIsLoading(true);
    setShowParsedQueryDetails(false);
    setShowQueryDetails(false);
    setShowAll(false);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSearchState({
        docs: mockSearchData.docs,
        numFound: mockSearchData.numFound,
        maxScore: Math.max(...mockSearchData.docs.map(doc => doc.score)),
        state: 1, // DID_SEARCH
        errorMsg: '',
        engine: 'solr',
        linkUrl: mockSearchData.linkUrl,
        queryDetails: { test: 'query details' },
        parsedQueryDetails: { test: 'parsed query details' },
        paging: false,
        moreResults: true
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
    setShowAll(false);
  };

  // Initialize search
  useEffect(() => {
    reset();
  }, []);

  // Toggle query details
  const toggleQueryDetails = () => {
    setShowQueryDetails(!showQueryDetails);
  };

  // Toggle parsed query details
  const toggleParsedQueryDetails = () => {
    setShowParsedQueryDetails(!showParsedQueryDetails);
  };

  // Toggle show all for stacked chart
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Render stacked chart component
  const StackedChart = (props) => {
    const { hots, detailed } = props;
    const maxHotMatches = 3;
    
    return (
      <div className="stacked-chart">
        {hots.length <= maxHotMatches ? (
          <div>
            {hots.map((match, index) => (
              <div key={index} className="graph-explain">
                <div className="graph-label">{match.description}</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${match.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {detailed && (
              <a className="detailed-link" onClick={detailed}>Detailed</a>
            )}
          </div>
        ) : (
          <div>
            {hots.slice(0, maxHotMatches).map((match, index) => (
              <div key={index} className="graph-explain">
                <div className="graph-label">{match.description}</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${match.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="collapsed-section">
              {showAll ? (
                hots.slice(maxHotMatches).map((match, index) => (
                  <div key={index} className="graph-explain">
                    <div className="graph-label">{match.description}</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${match.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
            {detailed && (
              <a className="detailed-link" onClick={detailed}>Detailed</a>
            )}
            <a 
              className="show-more-link" 
              onClick={toggleShowAll}
            >
              Show {showAll ? 'Less' : 'More'}
            </a>
          </div>
        )}
      </div>
    );
  };

  // Render document row component
  const DocRow = (props) => {
    const { doc, maxScore } = props;
    return (
      <div className="doc-row">
        <div className="doc-score-section">
          <h4>{doc.score}</h4>
          <StackedChart 
            hots={doc.hotMatches || []} 
            detailed={() => console.log('Detailed view')}
          />
        </div>
        <div className="doc-content-section">
          <h4>Document {doc.id}</h4>
          <div className="doc-snippets">
            <div className="snippet">
              <label className="field-label">Title:</label>
              <span>Sample Document Title</span>
            </div>
            <div className="snippet">
              <label className="field-label">Content:</label>
              <span>Sample document content snippet...</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render JSON explorer component
  const JsonExplorer = (props) => {
    const { jsonData } = props;
    if (!jsonData) return null;
    
    return (
      <div className="json-explorer">
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      </div>
    );
  };

  // Render search results
  const renderSearchResults = () => {
    if (searchState.state === 0) {
      return (
        <div className="no-search">
          <p>No search performed yet</p>
        </div>
      );
    }

    if (searchState.state === 3) {
      return (
        <div className="search-error">
          <p>Search error occurred</p>
          {searchState.errorMsg && (
            <pre>{searchState.errorMsg}</pre>
          )}
        </div>
      );
    }

    if (searchState.state === 1) {
      return (
        <div className="search-results-container">
          {/* Results count */}
          <div className="results-header">
            <small>
              {searchState.linkUrl ? (
                <a href={searchState.linkUrl} target="_blank" rel="noopener noreferrer">
                  {searchState.numFound} Total Results
                </a>
              ) : (
                <span>{searchState.numFound} Total Results</span>
              )}
            </small>
            
            {searchState.engine === 'solr' && (
              <>
                |
                <small>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleQueryDetails(); }}>
                    Query Details
                  </a>
                </small>
              </>
            )}
            |
            <small>
              <a href="#" onClick={(e) => { e.preventDefault(); toggleParsedQueryDetails(); }}>
                Parsed Query Details
              </a>
            </small>
          </div>

          {/* Query details sections */}
          {showQueryDetails && searchState.queryDetails && (
            <div className="query-details">
              <JsonExplorer jsonData={searchState.queryDetails} />
            </div>
          )}

          {showParsedQueryDetails && searchState.parsedQueryDetails && (
            <div className="parsed-query-details">
              <JsonExplorer jsonData={searchState.parsedQueryDetails} />
            </div>
          )}

          <hr />

          {/* Document results */}
          <div className="documents">
            {searchState.docs.map((doc) => (
              <div key={doc.id} className="document">
                <DocRow doc={doc} maxScore={searchState.maxScore} />
                <hr />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {searchState.paging && searchState.moreResults && (
            <div className="pager">
              <a href="#" onClick={(e) => { e.preventDefault(); console.log('Show more results'); }}>
                Show More Results
              </a>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="search-results">
      <div className="search-controls">
        <button onClick={search} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={reset}>Reset</button>
        
        <div className="toggle-buttons">
          <button 
            onClick={toggleParsedQueryDetails}
            className={showParsedQueryDetails ? 'active' : ''}
          >
            Parsed Query Details
          </button>
          <button 
            onClick={toggleQueryDetails}
            className={showQueryDetails ? 'active' : ''}
          >
            Query Details
          </button>
        </div>
      </div>

      {isLoading && searchState.state === 0 && (
        <div className="loading">
          <img src="images/ajax-loader.gif" alt="Loading..." />
        </div>
      )}

      {renderSearchResults()}
    </div>
  );
};

export default SearchResults;
