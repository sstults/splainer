import { useState, useEffect } from 'react';

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
  settings?: any;
  paging?: boolean;
  moreResults?: boolean;
  grouped?: any;
  displayedResults?: number;
  searchArgsStr?: string;
  fieldSpecStr?: string;
  searchUrl?: string;
}

interface SearchSettings {
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

interface SearchService {
  createSearcher: (fieldSpec: any, searchUrl: string, parsedArgs: any, 
                  otherParam: string, customHeaders: any, engine: string) => any;
}

// Mock implementations of legacy services
const mockSearchService: SearchService = {
  createSearcher: (fieldSpec, searchUrl, parsedArgs, otherParam, customHeaders, engine) => {
    // Mock searcher implementation
    return {
      search: () => Promise.resolve(),
      pager: () => null,
      type: engine,
      numFound: 0,
      docs: [],
      grouped: {},
      linkUrl: searchUrl,
      inError: false
    };
  }
};

const mockSettingsStore = {
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
  save: () => {}
};

const mockSplSearchSvc = {
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
  },
  createSearch: (searchSettings: SearchSettings) => {
    // Mock search instance
    return {
      search: () => Promise.resolve(),
      page: () => Promise.resolve(),
      reset: () => {},
      hasGroup: () => false,
      moreResults: () => false,
      getOverridingExplain: () => null,
      state: 0, // NO_SEARCH
      docs: [],
      numFound: 0,
      maxScore: 0,
      linkUrl: '#',
      grouped: {},
      paging: false,
      errorMsg: '',
      settings: searchSettings,
      displayedResults: 0,
      searchArgsStr: () => searchSettings.searchArgsStr,
      fieldSpecStr: () => searchSettings.fieldSpecStr,
      searchUrl: () => searchSettings.searchUrl
    };
  }
};

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
    const searchSettings = mockSettingsStore.settings;
    const search = mockSplSearchSvc.createSearch(searchSettings);
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
      // Simulate search execution
      if (currSearch) {
        // In a real implementation, this would call the actual search
        await currSearch.search();
        
        // Mock search results
        const mockResults = {
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
          numFound: 3,
          maxScore: 1.5,
          state: 1, // DID_SEARCH
          linkUrl: 'https://solr.example.com/solr/core/select'
        };

        setSearchState({
          ...mockResults,
          settings: mockSettingsStore.settings,
          errorMsg: ''
        });
      }
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
