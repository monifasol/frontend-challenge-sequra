import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


window.onload = () => {
  // Wait until Merchant's site is fully loaded. 

  const widgetDivs = document.querySelectorAll('.sequra-financing-widget');

  // Inject React App into each class
  widgetDivs.forEach( (div) => {
    ReactDOM.render(
      <React.StrictMode>
        <App totalWithTax={ div.dataset.totalWithTax } widgetId={div.id} />
      </React.StrictMode>,
      div
    );
  });
};
