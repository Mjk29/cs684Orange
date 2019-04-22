import React, {Component} from 'react';
import Searchbar from './Searchbar.js'
import ItemOutput from './itemOutput.js'
import LoginModal from './LoginModal.js'
import CartModal from './CartModal.js'

import Topbar from './Topbar.js'
import BodyContainer from './BodyContainer.js'
import { Link, withRouter } from "react-router-dom";

import { connect } from 'react-redux';
import { connectToMasterServer} from '../actions'
import { bindActionCreators } from 'redux'

import Signup from './Signup.js'


class App extends Component{

	// componentDidMount(){
	// 	console.log("App mounted ")
	// 	this.props.connectToMasterServer({
	// 		query:this.props.userEmail, 
	// 		searchType:"fetchCartItems",
	// 		yieldAction:"FETCHED_CART_ITEMS"
	// 	})

	// }

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
