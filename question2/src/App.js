import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StockPage from './pages/StockPage';
import CorrelationHeatmap from './pages/CorrelationHeatmap';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={StockPage} />
          <Route path="/heatmap" component={CorrelationHeatmap} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
