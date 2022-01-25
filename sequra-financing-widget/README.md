
# SeQura Financing Widget

Build an embeddable widget in React during a frontend technical challenge for SeQura.


# Run it locally

- Run API: In the project directory `api`, run: `npm start`. API runs in `localhost:8080`
- Run Widget: In the project directory `sequra-financing-widget`, run: `npm start`.  Open `localhost:3000` in the browser. 
- Open Merchant's site in the browers to see the widget integrated (from the project directory `merchant-site`, open `product-page.html` in the browser.)


## Development and Feautures

Widget built in ReactJS, that contains two components, `<Widget />` as a main component, and `<InformationBox />` for the popup information.  
Uses Parcel to make the build to integrate in other websites.   
Uses SASS as CSS preprocessor.  
It's fully responsive, it adapts well to any merchant site.  


## Communication between Widget and backend: Calls to API

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

Launches the test runner.  
So far, tests are focused on the DOM elements. Work in progress!  

#### `npm run build:widget`

Using `parcel`, it makes a build to convert the React app in a small, optmized widget that will be easily embeddable on any website.\
See under `/widget` the resulted build which contains only `index.css` and `index.js`

