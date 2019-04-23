import { Auth } from "aws-amplify";
import React, { Component } from "react";

import {
  InputGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';

import {toggleRegisterModal} from '../actions'

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null,
      loginError:"",
      registerWindowState:false,
      userHasAuthenticated:false,
      modal: true
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggleRegisterWindowDispatch(this.props.registerWindowState)
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
 
    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({
        userHasAuthenticated:true,
        loginError:""
      });
      this.setState({
        newUser
      });
    } catch (e) {
      // alert(e.message);
      console.log(e.message);
      
      this.setState({ loginError: e.message});
    }
  
    this.setState({ isLoading: false, });
  }
  
  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
  
      this.props.userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
      
      this.setState({ isLoading: false,
        loginError: e.message, });
    }
  }

  updateEmail= (event) =>{
    this.setState({
      email: event.target.value
    });
  }
  
  updatePassword = (event) =>{
    this.setState({
      password: event.target.value
    });
  }
  
  loginErrorDisplay = () =>{
    if (this.state.loginError.length !== 0 ) {
      return(
        // <Alert id="userAlreadyExistsAlert" color="danger">{this.state.loginError}</Alert>
        <Alert id="userAlreadyExistsAlert" color="danger">{this.state.loginError}</Alert>
      )
    }
    else if (this.state.userHasAuthenticated === true){
      return(
        <Alert id ="succesfulNewUserRegistration" color="success">Registration was succesfull</Alert>
      )
    }
  }

  
  render() {
    return (
      <div>
      <Modal isOpen={this.props.registerWindowState} toggle={this.toggle} className={this.props.className}>
      <ModalHeader toggle={this.toggle}>Web Store Register</ModalHeader>
      <ModalBody>

      <InputGroup>
        <Input 
        name="registerEmailInput"
        value={this.state.email} 
        onChange={this.updateEmail}
        placeholder="Email"
        />
      </InputGroup>

      <InputGroup>
        <Input
        name="registerEmailPassword"
        type="password"
        value={this.state.password} 
        onChange={this.updatePassword}
        placeholder="Password" />
      </InputGroup>


      </ModalBody>
      <ModalFooter>
        {this.loginErrorDisplay()}
        <Button id="submitRegisterUser" color="success" onClick={this.handleSubmit}>register</Button>{' '}
      </ModalFooter>
      </Modal>

      </div>

      );
  }
}


const mapDispatchToProps = (dispatch) => ({
  toggleRegisterWindowDispatch: (toggle) => dispatch(toggleRegisterModal(toggle)),
})

const mapStateToProps = state => {
  return {
    registerWindowState: state.registerWindowState,
    isloading:state.loading,
  }
}

export default Signup = connect(mapStateToProps,mapDispatchToProps)(Signup);
