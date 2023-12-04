import React from 'react';
import './App.css';
import UserFlowChart from './userflowchart';
import DataModelDiagram from './datamodeldiagram';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DataModelDiagram />
      </header>
    </div>
  );
}

export default App;
