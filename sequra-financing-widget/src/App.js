import Widget from './components/Widget.jsx'

function App( {totalWithTax} ) {
  return (
    <div className="App">  
      <div id="overlay" data-testid="overlay"></div>
      <Widget totalWithTax={totalWithTax} />
    </div>
  );
}

export default App;
