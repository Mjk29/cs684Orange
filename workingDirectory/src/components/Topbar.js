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
  DropdownItem } from 'reactstrap';
import Searchbar from './Searchbar.js'
import { changeUserLoginWindowStateAction } from '../actions'
import { connect } from 'react-redux';





  class Topbar extends React.Component {
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

  	popupTest(){
  		alert("asdasdas")
  	}
	showLoginWindow = () => {
		this.props.dispatchShowLoginWindow({
			loginWindowState:true,
		})
	}


	accountState  () {
		console.log("her are the account stare proops")
		console.log(this.props)

		if (this.props.loading == false) {
			// user is logged in
			if (this.props.userEmail.length != 0) {
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
			else if (this.props.userEmail.length == 0) {
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
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Searchbar />
              </NavItem>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Account Settings
                </DropdownToggle>
                 
                  <div className="contacts">{this.accountState()}</div>

              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}



const mapDispatchToProps = (dispatch) => ({
	dispatchShowLoginWindow: (loginWindowState) => 
      dispatch(changeUserLoginWindowStateAction(loginWindowState)),
 })

const mapStateToProps = state => {
  return {
     userEmail: state.userEmail,
     loading:state.loading,

   }
}



export default Topbar = connect(mapStateToProps,mapDispatchToProps)(Topbar);
