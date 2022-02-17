import React from 'react';
import Widget from './components/Widget.jsx';

function App( {totalWithTax, widgetId} ) {
  return (
    <div className="App">  
      <div id="overlay" data-testid="overlay"></div>
      <Widget totalWithTax={totalWithTax} widgetId={widgetId} />
    </div>
  );
}

export default App;
