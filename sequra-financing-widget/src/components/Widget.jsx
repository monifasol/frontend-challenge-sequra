import { React, useState, useEffect } from 'react';
import axios from 'axios';
import InformationBox from './InformationBox';

const API_URI = process.env.REACT_APP_API_URL;

const Widget = ( {totalWithTax, widgetId} ) => {

  const [ instalmentsOptions, setInstalmentsOptions ] = useState([]);
  const [ selectedInstalment, setSelectedInstalment ] = useState({});
  //const [ colorScheme, setColorScheme ] = useState('default');
    
  const priceElement = document.querySelector(`#${widgetId}`);

  // Set InstalmentsOptions when component renders the first time
  useEffect( ()=> {
    updateSelectInstalments(totalWithTax);
  }, []);

  // event "pricechanged" defined in (and dispatched from) Merchant Site!
  priceElement.addEventListener('pricechanged', (e) => {
    // e.stopPropagation() was still firing many, many events!
    e.stopImmediatePropagation();        
    const newPrice = priceElement.dataset.totalWithTax;
    updateSelectInstalments(newPrice);
  });

  // when selectedInstalment changes, send POST request to EventsAPI
  useEffect( ()=> {
    if (Object.keys(selectedInstalment).length !== 0) {
      sendPostReqEventAPI('instalmentsOptionChanged'); 
    }
  }, [selectedInstalment]);
    

  const updateSelectInstalments = (price) => {
        
    axios
      .get(`${API_URI}/credit_agreements?totalWithTax=${price}`)
      .then((response) => {
        const instalmentsOpt = [...response.data];
        setInstalmentsOptions(instalmentsOpt);
        setSelectedInstalment(instalmentsOpt[0]);            // first instalment as default (the one selected on the dropdown)
      })
      .catch((error) => { console.log(error); });

    return () => {
      // cleanup function
      setInstalmentsOptions([]);
      setSelectedInstalment({});
    };
  };

  const sendPostReqEventAPI = (typeEvent) => {
        
    const bodyRequest = { 
      'context': 'financingCostWidget', 
      'type': typeEvent, 
      'selectedInstalment': { 
        'instalment_count': selectedInstalment ? selectedInstalment.instalment_count : 0,
        'instalment_amount': selectedInstalment ? selectedInstalment.instalment_amount.value : 0,
      }
    };       

    axios
      .post(`${API_URI}/events`, { bodyRequest })
      .then((response) => {
        console.log(`POST request to events API successful with response: ${response.status}`);
      })
      .catch((error) => {
        console.log(`POST request unsuccessful, error: ${error}`);
      });
  };

  const handleEventPopup = (popupIsOpened) => {
    const typeEvent = popupIsOpened ? 'moreInfoPopupOpened' : 'moreInfoPopupClosed';
    sendPostReqEventAPI(typeEvent);
    togglePopup();
  };

  const handleChangeInstalmentOpt = (count) => {

    const newSelectedInstalment = instalmentsOptions.filter( option => option.instalment_count.toString() === count )[0];
    setSelectedInstalment(newSelectedInstalment);
  };

  const togglePopup = () => {

    const popup = document.getElementById(`popupInfo${widgetId}`);
    const overlay = document.getElementById('overlay');

    if (overlay) { overlay.classList.toggle('show'); }
    if (popup) { popup.classList.toggle('show'); }

  };

  return (
    <>
            
      <div className="popup" id={`popupInfo${widgetId}`} data-testid='popup'>
        <span className="close-popup" onClick={ () => handleEventPopup(false) }>x</span>
        <InformationBox selectedInstalment={selectedInstalment} /> 
      </div>

      <div className='instalments-box'>

        <div className='flex-top-widget'>
          <label htmlFor='selectInstalmentOpt' className='label-select'>Págalo en</label>
          
          <div className='color-selection-wrapper'>
            <div className='color-selection lightgreen' data-color='lightgreen'></div>
            <div className='color-selection coral' data-color='coral'></div>
            <div className='color-selection lightblue' data-color='lightblue'></div>
          </div>

          <span className="more-info" data-testid='moreInfoLink' onClick={ () => handleEventPopup(true) }>más info</span>
        </div>

        <select className='instalments-options' id='selectInstalmentOpt' data-testid='selectInstalments' onChange={ (e) => handleChangeInstalmentOpt(e.target.value) }>
          { instalmentsOptions.map( (option, i) => {
            return (
              <option value={option.instalment_count} key={i} data-testid="selectOption">
                {`${option.instalment_count} cuotas de ${option.instalment_amount.string}/mes`}
              </option>
            );
          }) }                               
        </select>

      </div>
    </>
  );
};

export default Widget;
