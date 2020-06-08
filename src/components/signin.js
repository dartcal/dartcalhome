/* eslint no-alert: 0 */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Input } from 'reactstrap';
import firebase from 'firebase';
import logo from '../pictures/DartCalLogo.png';
import { NavLink, withRouter } from 'react-router-dom';

import '../cssfolder/signin.css';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  onPasswordChange= (event) => {
    this.setState({ password: event.target.value });
  }

  handleSigninButtonClick = (event) => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
      alert(error);
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.history.push('/profile');
      }
      else {
        this.props.history.push('/');
      }
    });
  }

  handleCancelButtonClick = (event) => {
    this.props.history.push('/');
  }

  render() {
    return (
    <div className="allSignIn">
      <div className="dartCalLogo">
        DartCal
        <img width="90px" src={logo} style={{"vertical-align":"bottom"}}/>
      </div>
      <div className="logininfo">
        <div className="inputline">
          Username: &nbsp; 
          <Input className="response" id="emailInputBar" placeholder="Dartmouth Email" onChange={this.onEmailChange} value={this.state.email} />
        </div>
        <div className="inputline">
          Password: &nbsp; 
          <Input type="password" className="response" id="passwordInput" placeholder="Password" onChange={this.onPasswordChange} value={this.state.password} />
        </div>
        <div className="signup">
          New to DartCal? &nbsp; 
          <NavLink to="/signup">
             Sign Up 
          </NavLink>
        </div>
      </div>
        <div className="enterorcancelbuttons">
          <Button onClick={this.handleSigninButtonClick}>Log In</Button> &nbsp;
          <Button  onClick={this.handleCancelButtonClick}>Cancel</Button>
        </div>
    </div>
    );
  }
}

// export default NewPost;
export default withRouter((SignIn));