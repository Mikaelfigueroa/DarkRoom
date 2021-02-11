
import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect,useState, useEffect } from 'react-router-dom'
import axios from 'axios';
import { MyContext } from "../myProvider"


class Login extends React.Component {


  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      redirect: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  handleSubmit(event) {
    let value = this.context;
    event.preventDefault();
    axios.post("/login",
      {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      }).then(res => {
        let value = this.context;
        value.setUser(res.data)
        this.setState({ redirect: "/post/index" })
      }
      ).catch(err => {   
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
        <h1 class="textcenter">Login</h1>
        <form className="user-form" onSubmit={this.handleSubmit}>
          <input id="username" name="username" type="string" placeholder="Username" />
          <input id="password" name="password" type="password" placeholder="Password" />
          <input type="submit" value="Login" />
        </form>
        <Link to="/register">
        <p>Dont have an account? Register</p>
        </Link>
      </div>
    )
  }
}

export default Login;
