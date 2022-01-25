# SeQura Frontend Challenge

This project contains 3 sub projects:

- A prototype of a widget that shows the finantial options seQura offers to the user to pay his purchases in instalments. It also contains a link (more info) which opens a popup whith more information about the service. It's build in ReactJS.

- An API to GET information about the credit agreements and to POST user events as the user interacts with the UI (provided by seQura). ExpressJS.

- A simulation of a merchant's site where the widget will be integrated (provided by seQura). HTML, CSS, jQuery.


# Run them locally

## Fist, run the API

In the project directory `api`, run: `npm start`

API runs in `localhost:8080`

Example: `http://localhost:8080/credit_agreements?totalWithTax=15000`

## Then, run Widget

In the project directory `sequra-financing-widget`, run: `npm start`

Open `localhost:3000` in the browser. 

## Open Merchant's site in the browser to see the widget integrated

From the project directory `merchant-site`, open `product-page.html` in the browser.

Example: `http://127.0.0.1:5500/merchant-site/product-page.html`


# Development and Features

- Project directory: `/sequra-financing-widget`  

- Widget prototype built in ReactJS, which contains two components, `<Widget />` as a main component, and `<InformationBox />` for the popup information. I chose React because is a very light library, and for a widget that needs to be integrated into any merchant site, it's good to think about performance. Also, I love the fact that in React, you write plain JS.

- SASS as CSS preprocessor. SASS helps the developer write code faster and cleaner. Thanks to the nesting, variables, functions,... even if this project was too small to explote all that, the nesting was enough to help me be faster and cleaner. I just love SASS. There's a task in package.json to watch for changes: `npm run watch:css` that makes your life even easier. 

- The widget is fully responsive, it adapts well to any merchant site. It's designed on relative measures, so that when it has to live in a different container, in any other website, it will adapt to it and flow with the size. 

- I used Parcel to make the build to integrate in other websites. It really optimizes the code to a level that with one .css and one .js file, you can run your widget anywhere. I created a special task for it in package-json, `npm run build:widget`. I explain below how to integrate it in any merchant site.

- The Popup appears with a small CSS transition. It appears smoothly over an overlay that changes the opacity of the background.

- I draw the 3 icons myself in Sketch ot have them in .png and good quality.

- I added tests, which I barely had experience with. I used testing-library from react, and tested mainly the DOM elements and their interactions with the user. This is a point where I'd loved to continue a lot longer, testing all the API calls, async code, and I would do it with "Mock Service Worker". I found courses and tutorials to follow, and I started doing a course in JEST. 


## If I'm a merchant, how do I integrate it into my site?

To place SeQura widget anywhere in your website, you will only need to follow these steps:

- Add these 3 lines in the code whenever you want to add the widget. 
- In the third line, replace PRICE by the total price with taxes of the product. (Note that the format of PRICE is: for “150 euros” would be “15000”, or “98,75 euros” would be “9875”.)
- If you want to add more than 1 widget, duplicate the 3rd line.

    ```
    <link href="<URL-SEQURA-WIDGET>/index.css" rel="stylesheet" />
    <script src="<URL-SEQURA-WIDGET>/index.js"></script>
    <div class="sequra-financing-widget" data-total-with-taxes="PRICE"></div>
    ```

## Communication between Widget and backend: Calls to API

- When the component mounts first time (through a useEffect) populates the select of finantial options, sending a GET request to ```CreditAgreementAPI``` to get those finantial options available for the user. ```totalWithTax``` as a parameter indicating a product value.

    ```${API_URI}/credit_agreements?totalWithTax=${totalWithTax}```

- For each user's UI interaction, triggers a POST request to EventsAPI.
    - When user changes the selected financing value:

        POST request to ```${API_URI}/events```
        with bodyRequest ```{"context":"financingCostWidget", "type":"instalmentsOptionChanged", "selectedInstalment": { "selectedInstalment" : {"instalment_count": "3", instalment_amount: "50"}}}```

    - When user opens the popup, then type will be: ```"type":"instalmentsInfoOpen"```

    - When user closes the popup, then type will be: ```"type":"instalmentsInfoClose"```


## Available Scripts

In the project directory `sequra-financing-widget`, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### `npm run watch:css`

Watches for changes in the scss files. When there is a change, sass compiles the scss file into css and the application reloads in the browser. 

#### `npm test`

Launches the test runner.   
To run the tests, the API should be running!! In the project directory `api`, run: `npm start`  
So far, tests are focused on the DOM elements. Work in progress!    

#### `npm run build:widget`

Using `parcel`, it makes a build to convert the React app in a small, optmized widget that will be easily embeddable on any website.\
See under `/widget` the resulted build which contains only `index.css` and `index.js`

