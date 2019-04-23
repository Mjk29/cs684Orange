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


class App extends Component{

	componentDidMount(){
		// console.log("App mounted ")
		// console.log(window.location.search)
		// console.log(JSON.parse(decodeURIComponent(window.location.search.slice(1))))
		if (window.location.search.length > 0) {
			try{
				var portObj = JSON.parse(decodeURIComponent(window.location.search.slice(1)))
				localStorage.setItem("serverPort",portObj.serverPort)
			}
			catch{
				console.log("malformed serverport")
			}
		}
		// var portObj = JSON.parse(decodeURIComponent(window.location.search.slice(1)))
		// // console.log(portObj.serverPort)
		// localStorage.setItem("serverPort",portObj)
		// // console.log(JSON.parse(window.location.search))
		// if (localStorage.hasOwnProperty("serverPort")) {
		// 	console.log("port alrady in lcal stoarre"+localStorage.serverPort)
		// }
		// else{
		// 	console.log("server p[ort notin local storage setting now")
		// 	localStorage.setItem("serverPort",window.location.search)
		// }

		// this.props.connectToMasterServer({
		// 	query:this.props.userEmail, 
		// 	searchType:"fetchCartItems",
		// 	yieldAction:"FETCHED_CART_ITEMS"
		// })

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
