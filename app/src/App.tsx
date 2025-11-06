import React from 'react';
import './App.css';
import SearchResults from './SearchResults';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Splainer React Application</h1>
        <p>Starting the migration from AngularJS to React/TypeScript</p>
      </header>
      <main>
        <SearchResults />
      </main>
    </div>
  );
}

export default App;
