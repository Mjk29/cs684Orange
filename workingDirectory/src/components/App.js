import React, {Component} from 'react';
// import Searchbar from './Searchbar.js'
import ItemOutput from './itemOutput.js'
import LoginModal from './LoginModal.js'
import CartModal from './CartModal.js'
import Signup from './Signup.js'

import Topbar from './Topbar.js'
// import BodyContainer from './BodyContainer.js'
// import { Link, withRouter } from "react-router-dom";

import { connect } from 'react-redux';
import { connectToMasterServer} from '../actions'
// import { bindActionCreators } from 'redux'

import Signup from './Signup.js'

export class App extends Component{

	componentDidMount(){
		if (window.location.search.length > 0) {

			try{
				var portObj = JSON.parse(decodeURIComponent(window.location.search.slice(1)))
				localStorage.setItem("serverPort",portObj.serverPort)
				localStorage.setItem("dashboardPort", portObj.dashboardPort)
			}
			catch{
				console.log("malformed serverport")
			}
		}
	}


	render() {
		return (
			<div>
				<Topbar />
				<LoginModal />
				<Signup />
				<CartModal />
				<ItemOutput />
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	connectToMasterServer: () => dispatch(connectToMasterServer()),

})


const mapStateToProps = state => {
	return {
		cartModalState: state.cartModalState,
		loading:state.loading,
		cartItems:state.cartItems,
		userEmail:state.userEmail,
	}
}
export default App = connect(mapStateToProps,mapDispatchToProps)(App);
