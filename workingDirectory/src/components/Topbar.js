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


	accountState () {
		console.log("her are the account stare proops")
		console.log(this.props)

		if (this.props.loading === false) {
			// user is logged in
			if (this.props.userHasAuthenticated === true) {
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
						<DropdownItem  onClick={this.showLoginWindow}>
							Login 
						</DropdownItem>
						<DropdownItem>
							Register
						</DropdownItem>
							<DropdownItem divider />
						<DropdownItem>
							Reset
						</DropdownItem>
 					</DropdownMenu>
				)
			}
		}
	}






	render() {
		return (
			<div>
				<Navbar color="light" light expand="xl">
					<Container fluid="true">
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
					<Row>
					<Nav className="ml-auto" navbar>
							<Col sm={{ size: 2, order: 0, offset: 0 }} ><NavbarBrand >React Webstore</NavbarBrand></Col>
							
							<Col sm={{ size: 8, order: 1, offset: 2 }}>									
								<NavItem>
								<Searchbar />
								</NavItem>
							</Col>

							<Col sm={{ size: 5, order: 2, offset: 1 }}>
								 <Button outline color="success" onClick={this.showShoppingCartToggle}>    Shopping Cart    </Button> 
							</Col>

							<Col sm={{ size: 2, order: 3, offset: 0 }}>
								<UncontrolledDropdown nav inNavbar>
									<DropdownToggle nav caret>
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
	dispatchShowLoginWindow: (loginWindowState) => 
		dispatch(changeUserLoginWindowStateAction(loginWindowState)),
	dispatchToggleCartModal: (cartModalState) =>
		dispatch(toggleCartModalAction(cartModalState)),
	fetchFromServer: (text) => dispatch(fetchFromServer(text)),



 })

const mapStateToProps = state => {
	return {
		userEmail: state.userEmail,
		loading:state.loading,
		userHasAuthenticated:state.userHasAuthenticated

	}
}



export default Topbar = connect(mapStateToProps,mapDispatchToProps)(Topbar);
