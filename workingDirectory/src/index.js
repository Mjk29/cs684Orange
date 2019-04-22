import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import reducer from './reducers';
import App from './components/App';
import rootSaga from './sagas';
import { BrowserRouter as Router } from "react-router-dom";
import Amplify from "aws-amplify";
import config from "./config";
import 'bootstrap/dist/css/bootstrap.min.css';



const sagaMiddleware = createSagaMiddleware();


	var previouslyLoggedIn = false
	// Setup local storage for userEmail key if not logged in
	if (localStorage.hasOwnProperty("userEmail")) {
		// console.log("has a local email")
		if (localStorage.userEmail === "undefined") {
			localStorage.setItem("userEmail", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
		}
		
	}
	else{
		// console.log("does not have local email")		// generate a random string for temp ID
		localStorage.setItem("userEmail", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
		
	}


console.log(localStorage.name)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	reducer,
	{
		loading:false,
		singleItem:[], 
		multipleItems:[],
		cartItems:{},
		userEmail:localStorage.userEmail,
		loginWindowState:false,
		cartModalState:false,
		userHasAuthenticated:false,
		previouslyLoggedIn:previouslyLoggedIn,
		registerWindowState: false,


	},
	composeEnhancers(
		applyMiddleware(sagaMiddleware)
	)
);

Amplify.configure({
	Auth: {
		mandatorySignIn: true,
		region: config.cognito.REGION,
		userPoolId: config.cognito.USER_POOL_ID,
		identityPoolId: config.cognito.IDENTITY_POOL_ID,
		userPoolWebClientId: config.cognito.APP_CLIENT_ID
	},  
	API: {
		endpoints: [
		{
			name: "notes",
			endpoint: config.apiGateway.URL,
			region: config.apiGateway.REGION
		},
		]
	}
});

sagaMiddleware.run(rootSaga);

render(
	<Router>
		<Provider store={store}>
			<App />
		</Provider>
	</Router>,
	document.getElementById('root'),
);

