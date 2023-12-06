import React from 'react';
import './App.css';
import UserFlowChart from './userflowchart';
import DataModelDiagram from './datamodeldiagram';
import ChatBot from './Qodly';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <ChatBot></ChatBot>
      </header>
    </div>
  );
}

export default App;
