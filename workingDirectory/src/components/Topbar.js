import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Container,
  Button

  } from 'reactstrap';
import Searchbar from './Searchbar.js'
import { changeUserLoginWindowStateAction, toggleCartModalAction,fetchFromServer } from '../actions'
import { connect } from 'react-redux';





export class Topbar extends React.Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	showLoginWindow = () => {
		this.props.dispatchShowLoginWindow({
			loginWindowState:true,
		})
	}

	showRegisterWindow = () => {
		this.props.dispatchShowRegisterWindow({
			registerWindowState:true,
		})
	}


	showShoppingCartToggle = () =>{
		this.props.fetchFromServer({
			query:this.props.userEmail, 
			searchType:"fetchCartItems",
			yieldAction:"FETCHED_CART_ITEMS"
		})
		this.props.dispatchToggleCartModal({
			cartModalState:!this.props.cartModalState,
		})
	}

	logoutUser = () =>{
		localStorage.setItem("userEmail", "undefined")
		localStorage.setItem("previouslyLoggedIn", false)
		window.location.reload();
	}


	accountState () {
		console.log("her are the account stare proops")
		console.log(this.props)

		if (this.props.loading === false) {
			// user is logged in
			if (this.props.userHasAuthenticated === true) {
				localStorage.setItem("userEmail", this.props.userEmail)
				return(
					<DropdownMenu right>
						<DropdownItem>
							User account 
						</DropdownItem>
						<DropdownItem>
							User Cart
						</DropdownItem>
							<DropdownItem divider />
						<DropdownItem>
							Reset
						</DropdownItem>
					</DropdownMenu>
				)
			}
			// user is not logged in
			else if (this.props.userHasAuthenticated === false) {
				return(
					<DropdownMenu right>
						<DropdownItem id="clickLoginSequence" onClick={this.showLoginWindow}>
							Login 
						</DropdownItem>
						<DropdownItem id="clickRegisterSequence" onClick={this.showRegisterWindow} >
							Register
						</DropdownItem>
							<DropdownItem divider />
						<DropdownItem id="logoutSequence" onClick={this.logoutUser}>
							Logout
						</DropdownItem>
 					</DropdownMenu>
				)
			}
		}
	}

	displayUserName (){
		if (localStorage.previouslyLoggedIn === "true"){
 			return(
				<div>{this.props.userEmail}</div>
			)
		}
		else{
			return(
				<div>guest</div>
			)
		}
	}

	render() {
		return (
			<div>
				<Navbar id="para1" color="light" light expand="xl">
					<Container fluid="true">
						<NavbarToggler id="clickMobileMenu" onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
					<Row>
					<Nav className="ml-auto" navbar>
							<Col sm={{ size: 2, offset: 0 }} ><NavbarBrand >React Webstore</NavbarBrand></Col>
							
							<Col sm={{ size: 8, offset: 0 }}>									
								<NavItem>
								<Searchbar />
								</NavItem>
							</Col>

							<Col sm={{ size: 2, offset: 0 }}>
								 <Button outline color="success" onClick={this.showShoppingCartToggle}>    Shopping Cart    </Button> 
							</Col>

							<Col sm={{ size: 3, offset: 1 }}>
								<Row>Hello</Row>
								<Row>{this.displayUserName()}</Row>
								 
							</Col>

							<Col sm={{ size: 2, offset: 0 }}>
								<UncontrolledDropdown nav inNavbar>
									<DropdownToggle id="dropDownToggle" nav caret>
									Account Settings
									</DropdownToggle>
									<div className="contacts">{this.accountState()}</div>
								</UncontrolledDropdown>
							</Col>
						</Nav>
					</Row>
					</Collapse>
					</Container>
				</Navbar>
			</div>
			);
	}
}



const mapDispatchToProps = (dispatch) => ({
	dispatchShowLoginWindow: (loginWindowState) => dispatch(changeUserLoginWindowStateAction(loginWindowState)),
	dispatchToggleCartModal: (cartModalState) => dispatch(toggleCartModalAction(cartModalState)),
	dispatchShowRegisterWindow: (registerWindowState) => dispatch(changeRegisterWindowStateAction(registerWindowState)),
	fetchFromServer: (text) => dispatch(fetchFromServer(text)),
	

 })

const mapStateToProps = state => {
	return {
		userEmail: state.userEmail,
		loading:state.loading,
		userHasAuthenticated:state.userHasAuthenticated,
		previouslyLoggedIn:state.previouslyLoggedIn,

	}
}



export default Topbar = connect(mapStateToProps,mapDispatchToProps)(Topbar);
