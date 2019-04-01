import React, {Component} from 'react';
// import Button from '../containers/Button';
// import NewsItem from '../containers/NewsItem'
// import Loading from '../containers/Loading'
import Searchbar from './Searchbar.js'
import ItemOutput from './itemOutput.js'

import Topbar from './Topbar.js'
import BodyContainer from './BodyContainer.js'
import { Link, withRouter } from "react-router-dom";



class App extends Component{

  render() {
    return (
// let App = () => (
	<div>
 	<Topbar />
 	<ItemOutput />
 	</div>
);
}
}


export default withRouter(App);
