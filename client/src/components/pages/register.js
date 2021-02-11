import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import { MyContext } from "../myProvider"


class Register extends React.Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      redirect: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    let value = this.context;
    event.preventDefault();
    axios({
      method: "POST",
      data: {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        fullname: document.getElementById('fullname').value
      },
      url: "/register",
    }).then(res => {
      let value = this.context;
      value.setUser(res.data)
      console.log(res.data)
      this.setState({ redirect: "/post/index" })
    }).catch(err => {
      this.setState({ error: err.response.data })
    });
    event.target.reset()
  }

  render() {
    let value = this.context;
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="user-control-form">
        {this.state.error && <p className="error">{this.state.error}</p>}
        <h1 className="textcenter" >Register</h1>
        <form className="user-form" onSubmit={this.handleSubmit}>
          <input type="text" id="username" name="username" placeholder="Username" />
          <input id="email" type="email" name="email" placeholder="Email" />
          <input id="password" type="password" name="password" placeholder="Password" />
          <input id="fullname" type="string" name="fullname" placeholder="Full Name" />
          <input type="submit" value="Sign Up" />
        </form>
        <Link to="/login">
          <p>Already have an account? Login</p>
        </Link>
      </div>
    )
  }
}

export default Register;
