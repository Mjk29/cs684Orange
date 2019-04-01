/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
// import {  Button, Modal, ModalHeader, 
//           ModalBody, ModalFooter, 
//           Form, FormGroup, Label, Input
//         } from 'reactstrap';


import {
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupDropdown,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
 } from 'reactstrap';


import { connect } from 'react-redux';
import { toggleLoginModal } from '../actions'
import { bindActionCreators } from 'redux'
 
 

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      buttonLabel:"ASDASDDSASDASD",
      loginWindowState:false,
      username:"",
      value:"",
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggleLoginWindowDispatch(this.props.loginWindowState)
    // this.setState(prevState => ({
    //   modal: !prevState.modal
    // }));
  }

  handleChange = (event) =>{
  	 this.setState({
      username: event.target.value
    });
  }
 



  render() {
    return (
      <div>
        <Modal isOpen={this.props.loginWindowState} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>


			<InputGroup>
			<Input 
	 			value={this.state.username} 
				onChange={this.handleChange}
				placeholder="username"
			/>
			</InputGroup>


			<InputGroup>
				<Inputvalue={
				this.state.username} 
				onChange={this.handleChange}
				placeholder="username" />
			</InputGroup>


          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>login</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>register</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}



const mapDispatchToProps = (dispatch) => ({
  toggleLoginWindowDispatch: (toggle) => dispatch(toggleLoginModal(toggle)),
})


const mapStateToProps = state => {
  return {
    loginWindowState: state.loginWindowState,
    loading:state.loading,
  }
}
export default LoginModal = connect(mapStateToProps,mapDispatchToProps)(LoginModal);
  