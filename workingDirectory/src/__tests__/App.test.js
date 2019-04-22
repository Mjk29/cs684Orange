import React from 'react';
import ReactDOM from 'react-dom';
import {App} from '../components/App';
import TestRender from '../components/TestRender.js'
import { Provider } from 'react-redux';

it('renders without crashing', () => {
	<Provider>
		const div = document.createElement('div');
		ReactDOM.render(<App />, div);
		ReactDOM.unmountComponentAtNode(div);
	</Provider>
		
});