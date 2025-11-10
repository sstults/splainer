import { useState, useEffect } from 'react';
import searchService, { SearchService, SearchSettings } from './services/searchService';
import settingsStoreService, { SettingsStoreService } from './services/settingsStoreService';

// Define TypeScript interfaces based on legacy AngularJS code
interface HotMatch {
  description: string;
  percentage: number;
}

interface NormalDoc {
  id: string;
  score: number;
  hotMatches?: HotMatch[];
  // Additional fields would be added based on actual data structure
}

interface SearchState {
  docs: NormalDoc[];
  numFound: number;
  maxScore: number;
  state: number; // NO_SEARCH = 0, DID_SEARCH = 1, WAITING_FOR_SEARCH = 2, IN_ERROR = 3
  errorMsg: string;
  engine?: string;
  linkUrl?: string;
  settings?: SearchSettings;
  paging?: boolean;
  moreResults?: boolean;
  grouped?: any;
  displayedResults?: number;
  searchArgsStr?: string;
  fieldSpecStr?: string;
  searchUrl?: string;
}

// Actual implementation would use these services
// const searchService = require('./services/searchService');
// const settingsStore = require('./services/settingsStore');
// const splSearchSvc = require('./services/splSearchSvc');

const SearchResults = () => {
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
  const [showAll, setShowAll] = useState(false);
  const [currSearch, setCurrSearch] = useState<any>(null);

  // Initialize search
  useEffect(() => {
    resetSearch();
  }, []);

  const resetSearch = () => {
    const searchSettings = settingsStoreService.settings;
    const search = searchService.createSearch(searchSettings);
    setCurrSearch(search);
    
    setSearchState({
      docs: [],
      numFound: 0,
      maxScore: 0,
      state: 0, // NO_SEARCH
      errorMsg: '',
      settings: searchSettings
    });
    setShowParsedQueryDetails(false);
    setShowQueryDetails(false);
    setShowAll(false);
  };

  const search = async () => {
    setIsLoading(true);
    setShowParsedQueryDetails(false);
    setShowQueryDetails(false);
    setShowAll(false);
    
    try {
      // Call the actual search method from our real implementation
      if (currSearch) {
        // Call the actual search method
        await currSearch.search();
        
        // Update state with results from the search
        setSearchState(prev => ({
          ...prev,
          state: currSearch.state,
          docs: currSearch.docs,
          numFound: currSearch.numFound,
          maxScore: currSearch.maxScore,
          linkUrl: currSearch.linkUrl,
          errorMsg: currSearch.errorMsg,
          settings: currSearch.settings
        }));
      }
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        state: 3, // IN_ERROR
        errorMsg: error instanceof Error ? error.message : 'Search failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

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
  const StackedChart = (props: { hots: HotMatch[], detailed?: () => void }) => {
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
  const DocRow = (props: { doc: NormalDoc }) => {
    const { doc } = props;
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
  const JsonExplorer = (props: { jsonData?: any }) => {
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
            
            {searchState.settings?.whichEngine === 'solr' && (
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
          {showQueryDetails && searchState.settings && (
            <div className="query-details">
              <JsonExplorer jsonData={searchState.settings} />
            </div>
          )}

          {showParsedQueryDetails && searchState.settings && (
            <div className="parsed-query-details">
              <JsonExplorer jsonData={searchState.settings} />
            </div>
          )}

          <hr />

          {/* Document results */}
          <div className="documents">
            {searchState.docs.map((doc) => (
              <div key={doc.id} className="document">
                <DocRow doc={doc} />
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
        <button onClick={resetSearch}>Reset</button>
        
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
