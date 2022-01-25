# SeQura Frontend Challenge

This project contains 3 sub project:

- A widget built in React, that shows the finantial options seQura offers to the user to pay his purchases more comfortably. It also offers a more info link whith more information about the service which opens as a popup.
- An API to GET information about the credit agreements and to POST user events as the user interacts with the UI. 
- A simulation of a merchant's site where the widget will be integrated. 

See [merchant's site with widget integrated](https://github.com/facebook/create-react-app).\
See [Widget running local](https://github.com/facebook/create-react-app)\
Visit [API](https://github.com/facebook/create-react-app)


# Run it locally

## Fist, run API

In the project directory `api`, run: `npm start`

## Then, run Widget

In the project directory `sequra-financing-widget`, run: `npm start`

# Run Merchant's site to see the integration

In the project directory `merchant-site`, open `product-page.html` in the browser.


# Details about SeQura Financing Widget

## Development and Feautures

Built in ReactJS\  
2 components: Widget as a main component, and InformationBox for the popup information.\  
Parcel to make the build to integrate in other websites.\   
SASS as CSS preprocessor.\
Fully responsive.\


## Calls to API

- When the component mounts first time (through a useEffect) populates the select of finantial options, sending a GET request to ```CreditAgreementAPI``` to get those finantial options available for the user. ```totalWithTax``` as a parameter indicating a product value.

    ```${API_URI}/credit_agreements?totalWithTax=${totalWithTax}```

- For each user's UI interaction, triggers a POST request to EventsAPI.
    - When user changes the selected financing value:

        POST request to ```${API_URI}/events```
        with bodyRequest ```{"context":"financingCostWidget", "type":"instalmentsOptionChanged", "selectedInstalment": { "selectedInstalment" : {"instalment_count": "3", instalment_amount: "50"}}}```

    - When user opens the popup, they type will be: ```"type":"instalmentsInfoOpen"```

    - When user closes the popup, they type will be: ```"type":"instalmentsInfoClose"```


## Available Scripts

In the project directory `sequra-financing-widget`, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### `npm run watch:css`

Watches for changes in the scss files. When there is a change, sass compiles the scss file into css and the application reloads in the browser. 

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build:widget`

Using `parcel`, it makes a build to convert the React app in a small, optmized widget that will be easily embeddable on any website.\
See under `/widget` the resulted build which contains only `index.css` and `index.js`

