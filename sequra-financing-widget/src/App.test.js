import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/user-event';

import App from './App';
import Widget from './components/Widget';

const totalWithTax = '15000'

const renderWidget = async () => {
  render(<Widget totalWithTax={totalWithTax} />);
  await screen.findByDisplayValue(['3 cuotas de 50 €/mes']);    // Waits until there's data in the select
};

test('totalWithTax exists and its initialized', () => {
  expect(totalWithTax).toBe('15000');
});

describe('App contains DOM elements', () => {

  test('renders an overlay div', () => {
    render(<App />);
    const overlayDiv = screen.getByTestId('overlay');
    expect(overlayDiv).toBeInTheDocument();
  });

  test('renders a finantial cost widget', () => {
    render(<App />);
    const labelElement = screen.getByText(/Págalo en/i);
    expect(labelElement).toBeInTheDocument();
  });

});

describe('Widget contains DOM elements', () => {

  test('widget renders label text', () => {
    renderWidget();
    const labelElement = screen.getByText(/Págalo en/i);
    expect(labelElement).toBeInTheDocument();
  });

  test('widget renders more info link', () => {
    renderWidget();
    const linkElement = screen.getByText(/más info/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('widget renders a popup container', () => {
    renderWidget();
    const popup = screen.getByTestId('popup');
    expect(popup).toHaveClass('popup');
    expect(popup).toHaveTextContent('x');
  });

  test('widget renders a select', () => {
    renderWidget();
    const selectElement = screen.getByTestId('selectInstalments');
    expect(selectElement).toBeInTheDocument();
  });

});

describe('Widget contains a select that reacts to user interaction', () => {
  
  test('select is empty before calling API that fills it with finantial options', () => {
    renderWidget();
    const selectElement = screen.getByTestId('selectInstalments');
    expect(selectElement).toHaveDisplayValue([]);
  });

  // "async await" because is asynchronous. It depends on a useEffect that makes an API call to populate the select.
  test('select is not empty after calling API that fills it with finantial options', async () => {
    renderWidget();
    const selectElement = await screen.findByTestId('selectInstalments');
    expect(selectElement).toBeInTheDocument();
  });

  test('select`s default value is the first finantial option`s value', async () => {
    renderWidget();
    const selectElement = await screen.findByDisplayValue(['3 cuotas de 50 €/mes']);
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('3');

    let options = screen.getAllByTestId('selectOption');
    expect(options[0].selected).toBeTruthy();
    expect(options[1].selected).toBeFalsy();    
  });

  test('select contains finantial options', async () => {
    renderWidget();
    const selectElement = await screen.findByDisplayValue(['3 cuotas de 50 €/mes']);
    expect(selectElement).toHaveTextContent('3 cuotas de 50 €/mes', '6 cuotas de 25 €/mes');
  });

  test('when user changes option in select, displayed option changes', async () => {
    renderWidget();

    const selectElement = await screen.findByDisplayValue(['3 cuotas de 50 €/mes'])
    fireEvent.change(selectElement, { target: { value: '6' } });
    const selectElementChanged = await screen.findByDisplayValue(['6 cuotas de 25 €/mes']);
    expect(selectElementChanged).toHaveValue('6');

    let options = screen.getAllByTestId('selectOption');
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();   
  });
});

describe('If totalWithTax changes, the values of the select change too', () => {
  
  test('select`s default value is the first finantial option`s value', async () => {
    render(<Widget totalWithTax='300000' />);

    const selectElement = await screen.findByDisplayValue(['3 cuotas de 1000 €/mes']);
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('3');

    let options = screen.getAllByTestId('selectOption');
    expect(options[0].selected).toBeTruthy();
    expect(options[1].selected).toBeFalsy();    
  });

  test('select contains finantial options', async () => {
    render(<Widget totalWithTax='300000' />);

    const selectElement = await screen.findByDisplayValue(['3 cuotas de 1000 €/mes']);
    expect(selectElement).toHaveTextContent('3 cuotas de 1000 €/mes', '6 cuotas de 500 €/mes');
  });

  test('when user changes option in select, displayed option changes', async () => {
    render(<Widget totalWithTax='300000' />);

    const selectElement = await screen.findByDisplayValue(['3 cuotas de 1000 €/mes'])
    fireEvent.change(selectElement, { target: { value: '6' } });
    const selectElementChanged = await screen.findByDisplayValue(['6 cuotas de 500 €/mes']);
    expect(selectElementChanged).toHaveValue('6');

    let options = screen.getAllByTestId('selectOption');
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();   
  });

});

describe('More info link reacts to user interaction', () => {
  
  test('At first, popup is not visible', () => {
    renderWidget();
    const popup = screen.getByTestId('popup');
    expect(popup).not.toHaveClass('show');
  });

  test('when user clicks more info link, popup has class show', async () => {
    await renderWidget();

    const linkMoreInfo = screen.getByTestId('moreInfoLink')
    fireEvent.click(linkMoreInfo)
    expect(screen.getByTestId('popup')).toHaveClass('show');
  });

  test('When user clicks in more info link, popup has content', async () => {
    await renderWidget();

    const linkMoreInfo = screen.getByTestId('moreInfoLink');
    fireEvent.click(linkMoreInfo);
    const boxInfo = await waitFor(() => screen.findByText('2. Recibes tu pedido.'));
    expect(boxInfo).toBeInTheDocument();
  });

  /*
  test('When user clicks the close button, popup closes', async () => {
    await renderWidget();

    const linkMoreInfo = screen.getByTestId('moreInfoLink');
    const popup = screen.getByTestId('popup');

    fireEvent.click(linkMoreInfo);
    fireEvent.click(screen.getByText('x'));
    expect(popup).not.toHaveClass('show');
  });
  */

});

// Missing tests, that I will do using Mock Service Worker (msw) to simulate 
// a sever and make calls to the API.

// Test: when the user changes installment option, post request sent to API events with info:
// Test: when the user changes installment option, monthly fee is updated
// Test: when the user clicks more info, post request sent to API events with info:
// Test: when the user clicks close popup, post request sent to API events with info: 

